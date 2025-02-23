import Video from "./video";

interface props {
  other?: string;
  company?: string;
  setShowModal: (showModal: boolean) => void;
}

export default function Conversation({ other, company, setShowModal }: props) {
  const color =
    company === "spotify"
      ? "bg-[#1ED760]"
      : company === "mathworks"
      ? "bg-[#E43E04]"
      : company === "apple"
      ? "bg-[#B3B3B3]"
      : company === "epic"
      ? "bg-[#BE1E3F]"
      : company === "nvidia"
      ? "bg-[#76B900]"
      : company === "meta"
      ? "bg-[#007EF7]"
      : "bg-slate-400";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-[#101828] opacity-40" />
      <div className={`flex flex-col items-center relative max-h-screen`}>
        {company ? (
          <div className="mb-[30px] rounded-xl p-3 bg-white bg-opacity-90 text-[32px] font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            {company.toUpperCase()}
          </div>
        ) : null}
        <div
          className={`flex gap-9 p-11 ${color} w-[80%] h-[70%] border-[6px] border-solid border-black rounded-xl`}
        >
          <Video />
        </div>
        <div
          onClick={() => setShowModal(false)}
          className="bg-black cursor-pointer rounded-xl p-3 text-white bg-opacity-60 mt-4"
        >
          Back to booths
        </div>
      </div>
    </div>
  );
}
