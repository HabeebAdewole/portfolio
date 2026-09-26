import { logConfigured } from './lib/log';
import { Work } from './components/Work';
import { Contact } from './components/Contact';
import { Entry } from './components/Entry';
import { Hero } from './components/Hero';
import { Log } from './components/Log';
import { Masthead } from './components/Masthead';
import { Notes } from './components/Notes';
import { SectionHeader } from './components/SectionHeader';
import { Stack } from './components/Stack';
import { experience } from './content/experience';

import { sections } from './content/sections';
import './App.css';

function SectionBody({ id }: { id: string }) {
  switch (id) {
    case 'work':
      return <Work />;
    case 'experience':
      return (
        <>
          {experience.map((e) => (
            <Entry data={e} key={e.id} />
          ))}
        </>
      );
    case 'notes':
      return <Notes />;
    case 'stack':
      return <Stack />;
    case 'log':
      return <Log />;
    default:
      return null;
  }
}

export function App() {
return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <div className="wrap">
        <Masthead />

        <main id="main">
          <Hero />

          {sections.map((s) => (
            <section className="sect" id={s.id} key={s.id} aria-labelledby={`h-${s.id}`}>
              {s.id !== 'log' && <SectionHeader {...s} />}
              <SectionBody id={s.id} />
            </section>
          ))}
          {import.meta.env.DEV && !logConfigured && <section className="sect" id="log" aria-labelledby="h-log"><Log preview /></section>}
        </main>

        <Contact />
      </div>
    </>
  );
}
