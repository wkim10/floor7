import { socket } from "@/app/intro/page";
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

      socket.on("answer", ({ from, to, answer }) => {
        console.log("Receiving answer", from);
        pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("iceCandidate", ({ from, to, iceCandidate }) => {
        console.log("Receiving ice candidates from call()", from, iceCandidate);
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
      meVideoRef.current.muted = false;
    }

    if (otherVideoRef.current != null) {
      otherVideoRef.current.srcObject = remoteStream;
      // Only for testing
      otherVideoRef.current.muted = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("offer", async ({ from: to, to: from, offer }) => {
      console.log("Answering", to);

      // const pc = new RTCPeerConnection(configuration);
      const pc = pcRef.current;
      pcRef.current = pc;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { from: socket["id"], to: to, answer });

      socket.on("iceCandidate", ({ from, to, iceCandidate }) => {
        console.log("Receiving ice candidates", from);
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
  }, []);

  useEffect(() => {
    console.log("Offer listener count:", socket.listeners("offer").length);
    console.log("Answer listener count:", socket.listeners("answer").length);
    console.log(
      "ICE candidate listener count:",
      socket.listeners("iceCandidate").length
    );
  }, []);

  const cleanup = useCallback(() => {
    console.log("cleanup called");

    const pc = pcRef.current;
    pcRef.current = pc;
    pc.close();

    // Clean both local and and remote stream
    if (localStreamRef.current != null) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current != null) {
      remoteStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      remoteStreamRef.current = null;
    }
  }, []);

  return {
    call,
    camera,
    close: cleanup,
  };
};
