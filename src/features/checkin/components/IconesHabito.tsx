import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconeSono = (p: P) => (
  <svg {...base} {...p}>
    <path d="M17 15.5A7 7 0 0 1 9.5 6a7 7 0 1 0 7.5 9.5Z" />
    <path d="M14 3h3l-3 3h3M18.5 7.5h2l-2 2h2" />
  </svg>
)
export const IconeAgua = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 3.5s-5 5.5-5 9a5 5 0 0 0 10 0c0-3.5-5-9-5-9Z" />
    <path d="M17.5 11s-3 3.3-3 5.4a3 3 0 0 0 6 0c0-2.1-3-5.4-3-5.4Z" />
  </svg>
)
export const IconeDieta = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="4" width="11" height="15" rx="1.5" />
    <path d="M7 3h4v2H7zM6 9h1M9 9h3M6 12.5h1M9 12.5h3" />
    <circle cx="17" cy="17" r="3.5" />
    <path d="M17 13.5c0-1.2.6-2 1.8-2.3" />
  </svg>
)
export const IconeTreino = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6.5 8v8M4 10v4M17.5 8v8M20 10v4M6.5 12h11" />
  </svg>
)
export const IconeCamera = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </svg>
)
export const IconePrato = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="13" cy="12" r="7" />
    <circle cx="13" cy="12" r="3.5" />
    <path d="M3 4v5M4.5 9v11M6 4v5M3 9h3" />
  </svg>
)
export const IconeVenci = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4ZM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M9.5 17h5" />
  </svg>
)
