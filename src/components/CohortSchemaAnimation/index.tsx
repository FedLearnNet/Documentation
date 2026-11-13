import type {CSSProperties, ReactNode} from 'react';
import clsx from 'clsx';
import StepExplainer, {at, type ExplainerMode} from '../ConnectorSteps/StepExplainer';
import s from '../ConnectorSteps/styles.module.css';
import c from './styles.module.css';

const SCHEMA = 'Cardiology baseline';

type Node = [name: string, depth: number, concept?: string, type?: string];

const nodes: Node[] = [
  ['Patient', 0],
  ['Demographics', 1],
  ['Sex', 2, 'Sex', 'CATEGORICAL'],
  ['Date of birth', 2, 'Birth date', 'DATE'],
  ['Body weight', 1, 'Body weight', 'FLOAT · kg'],
  ['Diagnoses', 1, 'Diagnosis', 'STRING · list'],
];

const fields = nodes.filter(([, , concept]) => concept).map(([name]) => name);

function SchemaCard({delay = 0, compact = false}: {delay?: number; compact?: boolean}) {
  return (
    <div className={clsx(s.card, s.in)} style={at(delay)}>
      <div className={s.cardHead}>
        <span>Platform · Schema · {SCHEMA}</span>
        <span className={s.tag}>template</span>
      </div>
      {compact ? (
        <div className={s.row} style={{padding: '0.45rem 0.6rem'}}>
          {fields.map((field, i) => (
            <span key={field} className={clsx(s.chip, s.chipAccent, s.pop)} style={at(delay + 200 + i * 120)}>
              {field}
            </span>
          ))}
        </div>
      ) : (
        <div className={c.tree}>
          {nodes.map(([name, depth, concept, type], i) => (
            <div key={name} className={clsx(c.node, s.slideL)} style={at(delay + 250 + i * 260, {'--depth': depth})}>
              <span className={clsx(c.nodeName, !concept && c.nodeGroup)}>{name}</span>
              {concept ? (
                <span className={clsx(s.chip, s.pop)} style={at(delay + 1900 + i * 160)}>
                  ◎ {concept}
                </span>
              ) : (
                <span />
              )}
              {type ? (
                <span className={clsx(s.tag, s.pop)} style={at(delay + 2500 + i * 160)}>
                  {type}
                </span>
              ) : (
                <span className={clsx(s.tag, s.tagMuted)}>group</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SchemaScene() {
  const blocks: [string, string, string][] = [
    ['Ontology node', 'what a value means', 'var(--ca-map)'],
    ['Datatype node', 'how a value looks and is validated', 'var(--ca-transform)'],
    ['Schema node', 'where it sits in the structure', 'var(--ca-extract)'],
  ];
  return (
    <>
      <SchemaCard />
      <div className={c.blocks}>
        {blocks.map(([name, text, color], i) => (
          <div key={name} className={clsx(c.block, s.in)} style={at(3400 + i * 250, {'--c': color})}>
            <b>{name}</b>
            {text}
          </div>
        ))}
      </div>
      <div className={s.row}>
        <span className={clsx(s.chip, s.chipMuted, s.pop)} style={at(4400)}>
          0 patients
        </span>
        <span className={clsx(s.caption, s.fade)} style={at(4500)}>
          A schema only describes data. It holds no records.
        </span>
      </div>
    </>
  );
}

const records = [
  ['P-001', 'male', '1980-04-12', '79.8', 'I10'],
  ['P-002', 'female', '1975-09-30', '64.0', 'E11.9'],
  ['P-003', 'female', '1991-01-08', '58.2', 'I50.9'],
];

function CohortScene() {
  const tabs = ['Details', 'Schema', 'Queriability', 'Access', 'Patients', 'Connector'];
  return (
    <>
      <SchemaCard compact />
      <div className={clsx(s.arrow, s.fade)} style={at(900)}>
        New Cohort · select schema · Create
      </div>
      <div className={clsx(s.card, s.in)} style={at(1200)}>
        <div className={s.cardHead}>
          <span>Client · Clinic A · Cohort · Heart failure 2024</span>
          <span className={clsx(s.tag, s.tagNew)}>local</span>
        </div>
        <div className={s.miniTabs}>
          {tabs.map((tab) => (
            <span key={tab} className={clsx(s.miniTab, tab === 'Patients' && s.miniTabActive)}>
              {tab}
            </span>
          ))}
        </div>
        <div className={s.row} style={{padding: '0.45rem 0.6rem 0'}}>
          <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(1900)}>
            ⇣ Connector run
          </span>
          <span className={clsx(s.caption, s.fade)} style={at(2000)}>
            values are checked against the schema
          </span>
        </div>
        <div className={s.tblScroll}>
          <table className={s.tbl}>
            <thead>
              <tr>
                <th>Patient</th>
                {fields.map((field, i) => (
                  <th key={field} className={clsx(s.colFocus, s.fade)} style={at(1500 + i * 120)}>
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((row, r) => (
                <tr key={row[0]} className={s.slideL} style={at(2400 + r * 500)}>
                  {row.map((cell, i) => (
                    <td key={i} className={clsx(i > 0 && s.flash)} style={at(2500 + r * 500 + i * 60)}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={clsx(s.caption, s.fade)} style={at(4200)}>
        Records, connectors, and access settings stay in the Client.
      </div>
    </>
  );
}

type Site = [clinic: string, cohort: string, patients: number, answer: string | null];

const sites: Site[] = [
  ['Clinic A', 'Heart failure 2024', 412, '≈ 190'],
  ['Clinic B', 'Cardio registry', 958, '≈ 440'],
  ['Clinic C', 'HF follow-up', 31, null],
];

function SharedScene() {
  return (
    <>
      <SchemaCard compact />
      <div className={c.fanout} aria-hidden>
        {['16.5%', '50%', '83.5%'].map((x, i) => (
          <span key={x} className={s.fade} style={at(900 + i * 150, {'--x': x})} />
        ))}
      </div>
      <div className={c.trio}>
        {sites.map(([clinic, cohort, patients], i) => (
          <div key={clinic} className={clsx(s.card, s.in)} style={at(1000 + i * 200)}>
            <div className={s.cardHead}>
              <span>{clinic}</span>
              <span className={clsx(s.tag, s.tagNew)}>local</span>
            </div>
            <div className={c.site}>
              <span className={c.siteName}>{cohort}</span>
              <span className={s.row} style={{gap: '0.25rem'}}>
                <span className={s.dot} style={{'--c': 'var(--ca-load)'} as CSSProperties} />
                <span className={s.caption}>{patients} patients</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.row}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(2100)}>
          Federated query · <b>Body weight</b> &gt; 80 kg
        </span>
        <span className={clsx(s.caption, s.fade)} style={at(2300)}>
          same field in every cohort
        </span>
      </div>
      <div className={c.trio}>
        {sites.map(([clinic, , , answer], i) => (
          <div
            key={clinic}
            className={clsx(c.answer, !answer && c.answerWithheld, s.pop)}
            style={at(2900 + i * 350)}>
            <span>{answer ?? 'rejected'}</span>
            <span className={clsx(answer ? s.ok : s.err)}>{answer ? '✓' : '✕'}</span>
          </div>
        ))}
      </div>
      <div className={clsx(s.caption, s.fade)} style={at(4100)}>
        Counts are rounded up. Clinic C has too few matches and rejects the query.
      </div>
    </>
  );
}

const modes: ExplainerMode[] = [
  {
    key: 'schema',
    label: 'Schema',
    title: 'Describes data, holds none',
    text: 'A shared template on the Platform. It lists the fields, what they mean, and which values are valid.',
    config: [
      {name: 'Ontology node', text: 'What a field means, e.g. body weight.'},
      {name: 'Datatype node', text: 'Value type and rules, e.g. FLOAT in kg, 0–400.'},
      {name: 'Schema node', text: 'Places the field in a group, as single value or list.'},
    ],
    note: 'Schemas are created on the Platform. The Client only selects them.',
    scene: SchemaScene,
  },
  {
    key: 'cohort',
    label: 'Cohort',
    title: 'A local collection of patients',
    text: 'Created in the Client from one schema. Holds the patient records and their settings.',
    config: [
      {name: 'Schema', text: 'Chosen at creation. Defines the fields.'},
      {name: 'Records', text: 'Added by connector or by hand.'},
      {name: 'Settings', text: 'Details, queriability, access, members.'},
    ],
    note: 'Creating a cohort imports nothing. Records arrive when a connector runs or someone enters them.',
    scene: CohortScene,
  },
  {
    key: 'shared',
    label: 'One schema, many cohorts',
    title: 'Shared structure, local data',
    text: 'Clinics on the same schema use the same fields. The Platform can ask about one field everywhere. Each clinic keeps its own records and rules.',
    config: [
      {name: 'Shared', text: 'The schema: fields, meaning, types, rules.'},
      {name: 'Local', text: 'The cohort: records, connectors, access rules.'},
      {name: 'Matching', text: 'By ontology and datatype. Related schemas are partly comparable.'},
    ],
    note: 'Patient records never leave the Client. Only answers the cohort allows go out.',
    scene: SharedScene,
  },
];

/** `only` limits the explainer to the given mode keys, e.g. for a single slide. */
export default function CohortSchemaAnimation({only}: {only?: string[]}): ReactNode {
  const shown = only ? modes.filter((m) => only.includes(m.key)) : modes;
  return <StepExplainer eyebrow="Schema · cohort" accent="map" modes={shown} />;
}
