import React from "react";

export default function Logo() {
  return (
    <div className="w-full min-h-screen bg-[#d9ddd5] flex items-center justify-center p-6">
      <div className="flex items-center gap-10 scale-100 md:scale-110">

        {/* ================= LEFT ICON ================= */}
        <div className="relative w-[190px] h-[150px]">

          {/* Browser Window */}
          <div className="absolute top-0 left-0 w-[90px] h-[72px] border-[5px] border-[#241BFF] rounded-[2px]">

            {/* Dots */}
            <div className="absolute top-2 left-2 flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#241BFF]" />
              <span className="w-3 h-3 rounded-full bg-[#241BFF]" />
              <span className="w-3 h-3 rounded-full bg-[#241BFF]" />
            </div>

            {/* Code Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#241BFF] text-[34px] font-black tracking-tight">
                {"</>"}
              </span>
            </div>
          </div>

          {/* TOP CONNECTION LINE */}
          <div className="absolute top-[30px] left-[90px] w-[48px] h-[5px] bg-[#241BFF]" />

          {/* RIGHT VERTICAL LINE */}
          <div className="absolute top-[30px] left-[134px] w-[5px] h-[56px] bg-[#241BFF]" />

          {/* DOWN ARROW */}
          <div className="absolute top-[70px] left-[127px] text-[#241BFF] text-[24px] font-bold">
            ↓
          </div>

          {/* LEFT VERTICAL LINE */}
          <div className="absolute bottom-[22px] left-[38px] w-[5px] h-[48px] bg-[#241BFF]" />

          {/* LEFT ARROW */}
          <div className="absolute bottom-[56px] left-[30px] text-[#241BFF] text-[24px] font-bold">
            ↑
          </div>

          {/* BOTTOM CONNECTION */}
          <div className="absolute bottom-[22px] left-[38px] w-[66px] h-[5px] bg-[#241BFF]" />

          {/* ================= GEAR ================= */}
          <div className="absolute bottom-0 left-[72px]">

            <svg
              width="84"
              height="84"
              viewBox="0 0 100 100"
              className="drop-shadow-[0_0_2px_rgba(36,27,255,0.2)]"
            >
              {/* Teeth */}
              <g fill="#241BFF">
                <rect x="46" y="0" width="8" height="18" />
                <rect x="46" y="82" width="8" height="18" />

                <rect x="0" y="46" width="18" height="8" />
                <rect x="82" y="46" width="18" height="8" />

                <rect
                  x="14"
                  y="14"
                  width="8"
                  height="18"
                  transform="rotate(-45 18 23)"
                />

                <rect
                  x="78"
                  y="14"
                  width="8"
                  height="18"
                  transform="rotate(45 82 23)"
                />

                <rect
                  x="14"
                  y="68"
                  width="8"
                  height="18"
                  transform="rotate(45 18 77)"
                />

                <rect
                  x="78"
                  y="68"
                  width="8"
                  height="18"
                  transform="rotate(-45 82 77)"
                />
              </g>

              {/* Outer Circle */}
              <circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke="#241BFF"
                strokeWidth="6"
              />

              {/* Inner Circle */}
              <circle
                cx="50"
                cy="50"
                r="12"
                fill="#d9ddd5"
              />
            </svg>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex flex-col">

          {/* MAIN TITLE */}
          <div className="border-[3px] border-[#4B45FF] rounded-[6px] px-6 py-2">

            <h1
              className="
                text-[#241BFF]
                text-[72px]
                leading-none
                font-extrabold
                tracking-[4px]
                uppercase
                select-none
              "
              style={{
                fontFamily:
                  "'Montserrat', 'Arial Black', sans-serif",
              }}
            >
              AYACODIA
            </h1>
          </div>

          {/* SUBTITLE */}
          <div className="ml-4 mt-2">
            <p
              className="
                text-[#241BFF]
                text-[38px]
                tracking-[6px]
                font-medium
              "
              style={{
                fontFamily: "'Times New Roman', serif",
              }}
            >
              A votre service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}