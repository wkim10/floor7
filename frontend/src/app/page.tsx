"use client";

// import RoomMap from "@/components/RoomMap";
// import defaultMap from "@/utils/defaultMap.json";
import introMap from "@/utils/introMap.json";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Intro() {
  const [x, setX] = useState(14);
  const [y, setY] = useState(10);
  const router = useRouter();
  const positionRef = useRef({ x, y });

  useEffect(() => {
    positionRef.current = { x, y };
  }, [x, y]);

  useEffect(() => {
    // Move user around
    const moveUser = (event: KeyboardEvent) => {
      const movementDeltas = { x: 0, y: 0 };

      if (event.key === "w") {
        movementDeltas.y -= 1;
      } else if (event.key === "s") {
        movementDeltas.y += 1;
      } else if (event.key === "a") {
        movementDeltas.x -= 1;
      } else if (event.key === "d") {
        movementDeltas.x += 1;
      }

      const newX = positionRef.current.x + movementDeltas.y;
      const newY = positionRef.current.y + movementDeltas.x;

      setX(newX);
      setY(newY);

      if (introMap[newX][newY].type.startsWith("hole")) {
        setTimeout(() => {
          router.push("/intro");
        }, 500);
      }
    };
    document.addEventListener("keydown", moveUser);
    return () => document.removeEventListener("keydown", moveUser);
  }, []);

  return (
    <div className="h-full w-full p-4 flex flex-col bg-black text-black gap-y-8 mt-16">
      <div
        style={{
          display: "grid",
          // gridTemplateColumns: `repeat(${serverState.map.length}, ${32}px)`,
          // gridTemplateRows: `repeat(${serverState.map[0].length}, ${32}px)`,
          gridTemplateColumns: `repeat(${introMap.length}, ${32}px)`,
          gridTemplateRows: `repeat(${introMap[0].length}, ${32}px)`,
          gap: "0px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {introMap.map((block, rowIndex) =>
          block.map((users, colIndex) => {
            const tileKey = `${rowIndex}-${colIndex}`;
            const tileType = introMap[rowIndex][colIndex].type;
            // const tileCompany = introMap[rowIndex][colIndex].companyName;
            const showName = introMap[rowIndex][colIndex].showName;

            return (
              <div
                key={tileKey}
                className="relative border border-black/5 w-full h-full"
              >
                {/* Background color layer */}
                <div
                  // className={`absolute inset-0 ${
                  //   tileType === "booth"
                  //     ? tileCompany === "spotify"
                  //       ? "bg-[#1ED760]"
                  //       : tileCompany === "mathworks"
                  //       ? "bg-[#E43E04]"
                  //       : tileCompany === "apple"
                  //       ? "bg-[#B3B3B3]"
                  //       : tileCompany === "epic"
                  //       ? "bg-[#BE1E3F]"
                  //       : tileCompany === "nvidia"
                  //       ? "bg-[#76B900]"
                  //       : "bg-[#007EF7]"
                  //     : tileType === "chair"
                  //     ? "bg-slate-400 rounded-lg"
                  //     : tileType === "table"
                  //     ? "bg-blue-400"
                  //     : ""
                  // }`}
                  className={`absolute inset-0 ${
                    tileType === "hole"
                      ? "bg-purple-400"
                      : tileType === "hole1"
                      ? "bg-purple-300"
                      : tileType === "hole2"
                      ? "bg-purple-500"
                      : "bg-[#6d4121]"
                  }`}
                />
                {showName ? (
                  <div className="absolute top-6 left-1/2 transform -translate-x-16 whitespace-nowrap text-xs bg-white/80 px-2 py-1 rounded z-40">
                    Rabbit Hole
                  </div>
                ) : null}

                {/* Avatar layer */}
                {rowIndex === x && colIndex === y && (
                  <div className="absolute z-10 top-0 left-0">
                    <Image
                      alt="player-character"
                      src="/images/avatar4.png"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="absolute top-7 left-1/2 transform -translate-x-[26px] whitespace-nowrap text-xs bg-white/80 px-2 py-1 rounded z-40">
                      Alice
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
