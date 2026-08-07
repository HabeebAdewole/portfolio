import { Contact } from './components/Contact';
import { Entry } from './components/Entry';
import { Hero } from './components/Hero';
import { Masthead } from './components/Masthead';
import { Notes } from './components/Notes';
import { SectionHeader } from './components/SectionHeader';
import { Stack } from './components/Stack';
import { experience } from './content/experience';
import { projects } from './content/projects';
import { sections } from './content/sections';
import './App.css';

function SectionBody({ id }: { id: string }) {
  switch (id) {
    case 'work':
      return (
        <>
          {projects.map((p) => (
            <Entry data={p} key={p.id} />
          ))}
        </>
      );
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
              <SectionHeader {...s} />
              <SectionBody id={s.id} />
            </section>
          ))}
        </main>

        <Contact />
      </div>
    </>
  );
}
