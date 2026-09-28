import { Link, LinkProps } from 'react-router-dom';
import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark';
const styles: Record<Variant, string> = {
  primary: 'bg-ink text-white dark:bg-white dark:text-ink shadow-glow hover:-translate-y-0.5',
  secondary: 'bg-white dark:bg-white/10 border border-soft hover:bg-white dark:hover:bg-white/20',
  ghost: 'hover:bg-black/5 dark:hover:bg-white/10',
  dark: 'bg-electric text-white shadow-glow hover:-translate-y-0.5'
};
const base = 'focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition duration-300 disabled:cursor-not-allowed disabled:opacity-50';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };
export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={clsx(base, styles[variant], className)} {...props} />;
}

type LinkButtonProps = LinkProps & { variant?: Variant };
export function LinkButton({ className, variant = 'primary', ...props }: LinkButtonProps) {
  return <Link className={clsx(base, styles[variant], className)} {...props} />;
}

type AnchorButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant };
export function AnchorButton({ className, variant = 'primary', ...props }: AnchorButtonProps) {
  return <a className={clsx(base, styles[variant], className)} {...props} />;
}
