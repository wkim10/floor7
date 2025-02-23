import Image from "next/image";

interface BoothProps {
  color: string;
  company: string;
  recruiter: string;
  linkedin: string;
  position: string;
}

export default function Booth({
  color,
  company,
  recruiter,
  linkedin,
  position,
}: BoothProps) {
  return (
    <div
      className={`flex gap-9 p-11 w-[80%] h-[70%] bg-[${color}] border-[6px] border-solid border-black rounded-xl`}
    >
      <div className="w-[40%]">
        <div className="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mb-[18px] p-3 rounded-xl bg-white inline-block">
          Learn about us
        </div>
        <div className="grid grid-cols-2 gap-[30px]">
          <div className="bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-xl h-[127px] relative">
            <Image
              src={`/images/${company}1.png`}
              alt={`${company}1`}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-xl h-[127px] relative">
            <Image
              src={`/images/${company}2.png`}
              alt={`${company}2`}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-xl h-[127px] relative">
            <Image
              src={`/images/${company}3.png`}
              alt={`${company}3`}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-xl h-[127px] relative">
            <Image
              src={`/images/${company}4.png`}
              alt={`${company}4`}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
        <div className="flex gap-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-3 rounded-xl bg-white mt-6">
          <div className="h-[100px] w-[100px] rounded-[4px] relative">
            <Image
              src={`/images/${company}.png`}
              alt={`${company}`}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="text-2xl">{recruiter}</div>
            <div>
              <div>Senior Recruiter</div>
              <div>{linkedin}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mb-[18px] p-3 rounded-xl bg-white inline-block">
          Announcements
        </div>
        <div className="bg-black rounded-xl text-white p-3 bg-opacity-60">
          <div>We are interested in rising sophomores and juniors!</div>
          <div className="my-5">
            Our internship program will open on November 18th so keep an eye out
            for that!
          </div>
        </div>

        <div className="shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-3 mb-[18px] rounded-xl mt-6 bg-white inline-block">
          Open positions
        </div>
        <div className="flex flex-col gap-[18px]">
          <a
            href={position}
            target="_blank"
            className="bg-black underline rounded-xl text-white p-3 bg-opacity-60"
          >
            {position}
          </a>
          <a
            href={position}
            target="_blank"
            className="bg-black underline rounded-xl text-white p-3 bg-opacity-60"
          >
            {position}
          </a>
          <a
            href={position}
            target="_blank"
            className="bg-black underline rounded-xl text-white p-3 bg-opacity-60"
          >
            {position}
          </a>
        </div>
      </div>
    </div>
  );
}
