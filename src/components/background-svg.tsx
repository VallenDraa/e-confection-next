export function BackgroundSvg() {
  return (
    <svg
      style={{
        height: '100%',
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      }}
      version="1.1"
      width="1440"
      height="560"
      preserveAspectRatio="none"
      viewBox="0 0 1440 560"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g mask='url("#SvgjsMask1620")' fill="none">
        <rect
          width="1440"
          height="560"
          x="0"
          y="0"
          fill='url("#SvgjsLinearGradient1621")'
        ></rect>
        <path
          d="M1440 0L1418.22 0L1440 196.16z"
          fill="rgba(255, 255, 255, .1)"
        ></path>
        <path
          d="M1418.22 0L1440 196.16L1440 379.39L842.22 0z"
          fill="rgba(255, 255, 255, .075)"
        ></path>
        <path
          d="M842.22 0L1440 379.39L1440 399.02L663.99 0z"
          fill="rgba(255, 255, 255, .05)"
        ></path>
        <path
          d="M663.99 0L1440 399.02L1440 432.33L229.46000000000004 0z"
          fill="rgba(255, 255, 255, .025)"
        ></path>
        <path
          d="M0 560L32.68 560L0 461.40999999999997z"
          fill="rgba(0, 0, 0, .1)"
        ></path>
        <path
          d="M0 461.40999999999997L32.68 560L313.49 560L0 450.78999999999996z"
          fill="rgba(0, 0, 0, .075)"
        ></path>
        <path
          d="M0 450.78999999999996L313.49 560L673.25 560L0 231.68999999999997z"
          fill="rgba(0, 0, 0, .05)"
        ></path>
        <path
          d="M0 231.69L673.25 560L1039.1 560L0 118.36z"
          fill="rgba(0, 0, 0, .025)"
        ></path>
      </g>
      <defs>
        <mask id="SvgjsMask1620">
          <rect width="1440" height="560" fill="#ffffff"></rect>
        </mask>
        <linearGradient
          x1="15.28%"
          y1="-39.29%"
          x2="84.72%"
          y2="139.29%"
          gradientUnits="userSpaceOnUse"
          id="SvgjsLinearGradient1621"
        >
          <stop stopColor="rgba(250, 250, 250, 1)" offset="0.22"></stop>
          <stop stopColor="rgba(245, 245, 245, 1)" offset="1"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}
