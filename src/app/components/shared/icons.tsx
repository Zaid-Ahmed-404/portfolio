import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 18): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const ArrowUpRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ArrowRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowDown = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const Mail = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const Phone = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

export const MapPin = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const Globe = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

export const Download = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);

export const Copy = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
);

export const Check = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const Sun = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const Moon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
  </svg>
);

export const Award = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
  </svg>
);

export const GraduationCap = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="m2 9 10-5 10 5-10 5L2 9Z" />
    <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
  </svg>
);

export const Briefcase = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
  </svg>
);

export const Github = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export const Linkedin = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);
