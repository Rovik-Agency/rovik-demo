import { clsx } from 'clsx';

type Props = {
  className?: string;
  orbClassName?: string;
  size?: number;
};

export function HavaliMark({ className, orbClassName, size = 44 }: Props) {
  return (
    <span
      className={clsx(
        'relative inline-flex shrink-0 items-center justify-center rounded-[1.35rem] border border-white/15 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.32),transparent_32%),linear-gradient(135deg,#5B6CFF,#8A5CFF_62%,#67E8F9)] text-white shadow-glow',
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className={clsx('pointer-events-none absolute inset-[2px] rounded-[1.15rem] border border-white/20', orbClassName)} />
      <svg viewBox="0 0 44 44" className="h-[70%] w-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13 10.5C13 9.67 13.67 9 14.5 9H20.8C25.24 9 28.84 12.6 28.84 17.04C28.84 19.93 27.31 22.47 25.02 23.88L29.74 31.15C30.2 31.86 29.69 32.8 28.84 32.8H25.9C25.36 32.8 24.86 32.53 24.58 32.08L20.28 25.23H17.64V31.3C17.64 32.13 16.97 32.8 16.14 32.8H14.5C13.67 32.8 13 32.13 13 31.3V10.5Z"
          fill="white"
          fillOpacity="0.97"
        />
        <path d="M17.64 13.88V20.57H20.7C22.66 20.57 24.24 19.07 24.24 17.19C24.24 15.34 22.7 13.88 20.77 13.88H17.64Z" fill="#0B1020" fillOpacity="0.2" />
        <path d="M29.7 12.1L31.04 14.86L34.08 15.28L31.89 17.39L32.41 20.39L29.7 18.94L27 20.39L27.52 17.39L25.33 15.28L28.37 14.86L29.7 12.1Z" fill="white" fillOpacity="0.95" />
      </svg>
    </span>
  );
}
