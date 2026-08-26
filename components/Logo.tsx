import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
};

// The Vilas mark — the bone-circle "VS" monogram (Noah's real logo, dropped
// in 2026-08-26 and now used everywhere: header, footer, sticky corner mark,
// and the favicon/apple-icon — see app/icon.png). Source is
// /public/vilas-mark.webp. Swap that one file to change the mark everywhere.
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
