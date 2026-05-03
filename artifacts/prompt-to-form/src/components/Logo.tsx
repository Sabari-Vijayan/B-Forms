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
      <rect width="32" height="32" rx="5" fill="#212121" />
      {/* Faint label line + input bar — row 1 */}
      <rect x="7" y="7" width="9" height="1.5" rx="0.75" fill="white" opacity="0.45" />
      <rect x="7" y="10" width="18" height="3.5" rx="1" fill="white" />
      {/* Faint label line + input bar — row 2 */}
      <rect x="7" y="16.5" width="12" height="1.5" rx="0.75" fill="white" opacity="0.45" />
      <rect x="7" y="19.5" width="13" height="3.5" rx="1" fill="white" opacity="0.8" />
      {/* Submit pill */}
      <rect x="7" y="25.5" width="7" height="2.5" rx="1.25" fill="white" opacity="0.9" />
    </svg>
  );
}
