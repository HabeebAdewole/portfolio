import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const KEY = 'theme';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'dark' || attr === 'light' ? attr : systemTheme();
}

/**
 * The inline script in index.html has already applied any saved theme before
 * first paint, so this hook only has to stay in sync with it — never to set
 * the initial value itself, which would cause a flash.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  // Follow the OS while the user has not made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!document.documentElement.getAttribute('data-theme')) {
        setThemeState(systemTheme());
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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
