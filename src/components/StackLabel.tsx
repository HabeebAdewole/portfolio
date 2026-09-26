const logos: Record<string, string> = {
  typescript:'typescript', javascript:'javascript', python:'python', java:'java', html:'html', css:'css',
  react:'react', 'react 18':'react', 'next.js 14':'nextjs', vite:'vite', tailwind:'tailwind', 'tailwind css':'tailwind',
  flask:'flask', fastapi:'fastapi', mysql:'mysql', supabase:'supabase', 'scikit-learn':'scikitlearn',
  pytorch:'pytorch', 'pytorch geometric':'pytorch', pandas:'pandas', numpy:'numpy',
  git:'git', pytest:'pytest', figma:'figma', 'figma mcp':'figma', playwright:'playwright', vercel:'vercel',
};
/** Technology names remain visible; decorative icons do not repeat them for screen readers. */
export function StackLabel({ name }: { name: string }) {
  const logo = logos[name];
  return <span className="stack-label">{logo
    ? <img src={`/stack/${logo}.svg`} width="20" height="20" alt="" loading="lazy" />
    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {name === 'bcrypt' ? <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>
        : name === 'jwt' ? <><path d="m12 2 8 5v10l-8 5-8-5V7Z"/><path d="m8 12 3 3 5-6"/></>
        : name === 'imbalanced-learn' ? <><path d="M4 20V4M4 20h17M8 17V9M13 17V5M18 17v-5"/></>
        : <><path d="M8 7H3l4-4M3 7l4 4M16 17h5l-4 4M21 17l-4-4M10 18l4-12"/></>}
      </svg>}{name}</span>;
}
