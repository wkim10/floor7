import { socket } from "@/app/page";
import useAppStore from "@/store";
import { RefObject, useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

const configuration = {
  configuration: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  },
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

interface UseWebRtcProps {
  meVideoRef: RefObject<HTMLVideoElement | null>;
  otherVideoRef: RefObject<HTMLVideoElement | null>;
}

export const useWebRtc = ({ meVideoRef, otherVideoRef }: UseWebRtcProps) => {
  const {
    username: me,
    other,
    setOther,
  } = useAppStore(
    useShallow((state) => ({
      username: state.username,
      other: state.other,
      setOther: state.setOther,
    }))
  );
  const pcRef = useRef<RTCPeerConnection>(new RTCPeerConnection(configuration));
  const localStreamRef = useRef<MediaStream>(null);
  const remoteStreamRef = useRef<MediaStream>(null);

  const call = useCallback(
    async (other: string) => {
      console.log("Calling", other);
      // const pc = new RTCPeerConnection(configuration);
      const pc = pcRef.current;
      pcRef.current = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", {
        from: socket["id"],
        to: other,
        offer,
      });

      socket.on("answer", ({ from, answer }) => {
        console.log("Receiving answer", from);
        pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("iceCandidate", ({ from, iceCandidate }) => {
        console.log("Receiving ice candidates", from);
        pc.addIceCandidate(new RTCIceCandidate(iceCandidate));
      });

      pc.onicecandidate = (event) => {
        console.log("Receive ice candidate for me", event.candidate);
        if (event.candidate) {
          socket.emit("iceCandidate", {
            from: socket["id"],
            to: other,
            iceCandidate: event.candidate,
          });
        }
      };
    },
    [me, other]
  );

  const camera = useCallback(async () => {
    const pc = pcRef.current;
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = localStream;

    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      console.log(event);
      if (event.streams.length > 0) {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      }
    };

    if (meVideoRef.current != null) {
      meVideoRef.current.srcObject = localStream;
      // Only for testing
      meVideoRef.current.muted = true;
    }

    if (otherVideoRef.current != null) {
      otherVideoRef.current.srcObject = remoteStream;
      // Only for testing
      otherVideoRef.current.muted = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("offer", async ({ from: to, offer }) => {
      console.log("Answering", to);

      // const pc = new RTCPeerConnection(configuration);
      const pc = pcRef.current;
      pcRef.current = pc;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { from: socket["id"], to: to, answer });

      socket.on("iceCandidate", ({ iceCandidate }) => {
        pc.addIceCandidate(new RTCIceCandidate(iceCandidate));
      });

      pc.onicecandidate = (event) => {
        console.log("Receive ice candidate for other", event.candidate);
        if (event.candidate) {
          socket.emit("iceCandidate", {
            from: socket["id"],
            to: to,
            iceCandidate: event.candidate,
          });
        }
      };
    });
  }, [camera]);

  return {
    call,
    camera,
  };
};
