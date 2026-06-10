/* Геометрический логотип в стиле Точка роста — ромб/параллелограммы */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16 4L28 16L16 28L4 16L16 4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 8L24 16L16 24L8 16L16 8Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M16 12L20 16L16 20L12 16L16 12Z"
        fill="currentColor"
      />
    </svg>
  );
}
