import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
};

// The Vilas mark — the dark "V" disc. Source is /public/vilas-mark.webp
// (a transparent, circle-cropped build of Noah's vilasLogo). Swap that one
// file to change the mark everywhere.
export function Logo({ size = 28, className }: LogoProps) {
  return (
    <Image
      src="/vilas-mark.webp"
      alt="Vilas"
      width={size}
      height={size}
      priority
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
