const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const IconBack = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path {...P} d="M15 5l-7 7 7 7" /></svg>
)
export const IconClose = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path {...P} d="M6 6l12 12M18 6L6 18" /></svg>
)
export const IconUp = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path {...P} d="M6 15l6-6 6 6" /></svg>
)
export const IconDown = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path {...P} d="M6 9l6 6 6-6" /></svg>
)
export const IconTrash = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path {...P} d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" /></svg>
)
export const IconEye = ({ off = false }: { off?: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...P} d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle {...P} cx="12" cy="12" r="2.8" />
    {off && <path {...P} d="M4 20L20 4" />}
  </svg>
)
export const IconGear = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle {...P} cx="12" cy="12" r="3" />
    <path {...P} d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
  </svg>
)
export const IconChevron = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path {...P} d="M9 5l7 7-7 7" /></svg>
)
export const IconPlus = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path {...P} d="M12 5v14M5 12h14" /></svg>
)
export const IconSliders = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...P} d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle {...P} cx="16" cy="7" r="2" />
    <circle {...P} cx="10" cy="17" r="2" />
  </svg>
)
export const IconWarn = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...P} d="M12 3.5l9.5 16.5h-19z" />
    <path {...P} d="M12 10v4.5M12 17.4v.1" />
  </svg>
)
