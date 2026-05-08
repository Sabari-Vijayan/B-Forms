interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 28, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="B-Forms"
    >
      <rect width="32" height="32" rx="7" fill="#17181c" />
      <rect x="6" y="6" width="20" height="20" rx="5" fill="none" stroke="#d9dde3" strokeWidth="1" opacity="0.9" />
      <rect x="8" y="9" width="8" height="1.4" rx="0.7" fill="#8e949d" />
      <rect x="8" y="12" width="14" height="3.2" rx="1" fill="#f4f6f8" />
      <rect x="8" y="17.5" width="10" height="1.4" rx="0.7" fill="#8e949d" />
      <rect x="8" y="20.5" width="12" height="3.2" rx="1" fill="#d9dde3" />
      <rect x="20.5" y="20.5" width="3.2" height="3.2" rx="1" fill="#4f86ff" />
    </svg>
  );
}
