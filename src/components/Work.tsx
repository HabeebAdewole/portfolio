import { StackLabel } from './StackLabel';
import { projects } from '../content/projects';
import { Entry } from './Entry';
import { Icon } from './Icon';
const descriptions: Record<string, string> = {
  tracer: 'Following the money. A Bitcoin fraud detection system that explains what led to each prediction.',
  form: 'A place to find your next session. A gym frontend with class schedules, coaches and room to explore.',
  opportuna: 'Connecting students with internships. Discovery, applications and dashboards for both sides of recruitment.',
  drs: 'From a paper dues book to searchable payment records and departmental receipts.',
  evs: 'Supporting chapter elections, from nomination records to results on the official portal.',
};
export function Work() {
  return <div className="project-grid">{projects.map(p => {
    const shot = p.previews?.[0];
    const live = p.actions?.find(a => a.icon === 'external' && a.href);
    return <article className={`project-card ${shot ? '' : 'project-text'}`} key={p.id}>
      {shot && <div className={`project-stage stage-${p.id}`}><div className="project-window"><div className="window-bar" aria-hidden="true"><i/><i/><i/><span>{p.title} / {p.id === 'tracer' ? 'transaction analysis' : p.id === 'form' ? 'the club' : p.id === 'drs' ? 'receipt claims' : 'internships'}</span></div><img src={shot.poster} alt={shot.alt} loading="lazy" width={shot.w} height={shot.h}/></div></div>}
      <div className="project-title"><h3>{p.title}</h3>{live && <a href={live.href} target="_blank" rel="noreferrer">Open project <Icon name="external" size={13}/></a>}</div>
      <p className="project-description">{descriptions[p.id]}</p>
      <p className="project-tags">{p.stack?.slice(0, 4).map(name => <StackLabel key={name} name={name}/>) || p.deck.join(' · ')}</p>
      <details className="project-details"><summary>About this project</summary><Entry data={p}/></details>
    </article>;
  })}</div>;
}
