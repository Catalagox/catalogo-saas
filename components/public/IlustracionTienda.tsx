interface Props {
  variante?: "portada" | "producto";
  className?: string;
}

export default function IlustracionTienda({
  variante = "portada",
  className = "",
}: Props) {
  if (variante === "producto") {
    return (
      <svg
        viewBox="0 0 400 400"
        aria-hidden="true"
        focusable="false"
        className={`h-full w-full ${className}`}
      >
        <rect width="400" height="400" fill="#f3f4f1" />

        <ellipse
          cx="200"
          cy="330"
          rx="105"
          ry="12"
          fill="#dfe5dc"
        />

        <path
          d="M150 85 105 110 65 172 113 203 132 173
             132 315 268 315 268 173 287 203 335 172
             295 110 250 85 226 101 174 101Z"
          fill="#76a88b"
        />

        <path
          d="M174 101Q200 132 226 101L250 85
             Q200 125 150 85Z"
          fill="#427859"
        />

        <path
          d="M143 301H257"
          fill="none"
          stroke="#5b9270"
          strokeWidth="4"
        />

        <path
          d="M105 110 132 173M295 110 268 173"
          fill="none"
          stroke="#5b9270"
          strokeWidth="4"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={`h-full w-full overflow-hidden ${className}`}
    >
      <rect width="1200" height="600" fill="#edf2e8" />

      <circle cx="905" cy="130" r="70" fill="#e8cd8b" />

      <path
        d="M0 365 190 155 380 365 620 120
           880 370 1080 190 1200 310V600H0Z"
        fill="#cad8c4"
      />

      <path
        d="M0 445 235 265 455 445 740 230
           985 440 1200 295V600H0Z"
        fill="#a0b99e"
      />

      <path
        d="M0 475Q250 360 500 470
           T1000 445Q1120 420 1200 460V600H0Z"
        fill="#6d9478"
      />

      <path
        d="M0 535Q250 440 525 535
           T1200 495V600H0Z"
        fill="#3d7055"
      />

      <path
        d="M710 600Q665 545 725 497
           Q765 462 736 432"
        fill="none"
        stroke="#e4d6b5"
        strokeWidth="35"
        strokeLinecap="round"
      />

      <g fill="#315c45">
        <path d="M125 465 160 345 195 465Z" />
        <path d="M185 480 225 335 265 480Z" />
        <path d="M1000 485 1040 345 1080 485Z" />
        <path d="M1070 495 1115 325 1160 495Z" />
      </g>

      <g
        fill="none"
        stroke="#728872"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <path d="M530 120q15-14 30 0q15-14 30 0" />
        <path d="M630 165q12-11 24 0q12-11 24 0" />
      </g>
    </svg>
  );
}