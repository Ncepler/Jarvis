type LogoProps = {
  size?: number;
  className?: string;
};

// Placeholder mark — a circle bisected by a hairline. Swap this one file
// when the brand exists.
export function Logo({ size = 28, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
      <line
        x1="1"
        y1="14"
        x2="27"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
