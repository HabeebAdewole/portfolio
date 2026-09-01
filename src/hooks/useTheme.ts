import { useCallback, useState } from 'react';

export type Theme = 'light' | 'dark';

const KEY = 'theme';

/** Light unless the visitor has chosen otherwise. The OS is deliberately not
    consulted — see the comment on the boot script in index.html. */
const DEFAULT: Theme = 'light';

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'dark' || attr === 'light' ? attr : DEFAULT;
}

/**
 * The inline script in index.html has already stamped the theme before first
 * paint, so this hook only has to stay in sync with it — never to set the
 * initial value itself, which would cause a flash.
 *
 * There is no prefers-color-scheme listener any more: the site no longer
 * follows the OS, so there is nothing to follow.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    setThemeState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode — the choice just will not persist */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return { theme, toggle };
}
