import { Fragment, type ReactNode } from 'react';

/**
 * Renders the two inline markers used in content strings.
 *
 *   {{0.807}}  → a measured figure, the only ochre in prose
 *   **React**  → emphasis, by weight not colour
 *
 * Kept deliberately small. If content ever needs more than this, it wants
 * MDX, not a bigger regex.
 */
export function rich(text: string): ReactNode {
  const parts = text.split(/(\{\{[^}]+\}\}|\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      return (
        <span className="n" key={i}>
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
