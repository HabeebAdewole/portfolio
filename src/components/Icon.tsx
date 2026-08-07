import type { IconName } from '../content/types';

/* One authored set, one stroke weight family. No emoji, no icon font. */

const paths: Record<IconName, { d: string; w?: number; extra?: React.ReactNode }> = {
  github: {
    d: 'M9 19c-4 1.4-4-2.2-6-2.8m12 5.3v-3.6a3.1 3.1 0 0 0-.9-2.4c2.9-.3 6-1.4 6-6.4a5 5 0 0 0-1.4-3.4 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.6 0C6.4 1.4 5.3 1.7 5.3 1.7a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.8 8.6c0 5 3 6.1 5.9 6.4a3.1 3.1 0 0 0-.9 2.4v3.6',
  },
  external: { d: 'M7 17 17 7M9 7h8v8', w: 2 },
  arrow: { d: 'M5 12h14M13 6l6 6-6 6', w: 2 },
  download: { d: 'M12 3v13M6.5 11.5 12 17l5.5-5.5M4 20h16', w: 2 },
  mail: { d: 'M2.5 4.5h19v15h-19zM3 6l9 6.5L21 6' },
  linkedin: { d: 'M2.5 2.5h19v19h-19zM7 10v7M7 7v.01M11.5 17v-4a2.5 2.5 0 0 1 5 0v4' },
  x: { d: 'M3 3h4.5l5 6.8L18 3h3l-7.2 8.6L21.5 21H17l-5.3-7.2L5.5 21h-3l7.6-9.1Z', w: 1.7 },
  network: {
    d: 'M9.7 10.9 5.7 7.3M14.4 11.3l4-3.1M10.3 13.7l-3.6 3.9M14 13.5l3.7 3.2',
    w: 1.2,
    extra: (
      <>
        <circle cx="12" cy="12" r="2.4" />
        <circle cx="4" cy="6" r="1.7" />
        <circle cx="20" cy="7" r="1.7" />
        <circle cx="5.5" cy="19" r="1.7" />
        <circle cx="19" cy="18" r="1.7" />
      </>
    ),
  },
  vector: { d: 'M2.5 3.5h19v17h-19zM4 16.5 9 8l4 6 2.5-3.5L20 16.5Z', w: 1.3 },
  dashboard: { d: 'M2.5 4.5h19v15h-19zM2.5 9h19M8 9v10.5', w: 1.3 },
  wireframe: {
    d: 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z',
    w: 1.3,
  },
  sun: {
    d: 'M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6',
    w: 1.5,
    extra: <circle cx="12" cy="12" r="4.2" />,
  },
  moon: {
    d: 'M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z',
    w: 1.5,
  },
};

interface Props {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 13 }: Props) {
  const p = paths[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={p.w ?? 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {p.extra}
      <path d={p.d} />
    </svg>
  );
}
