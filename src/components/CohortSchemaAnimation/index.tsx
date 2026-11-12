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
        <span className={s.tag}>data contract</span>
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
            records are validated against the schema
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
        The cohort holds the records, its connectors, and its access settings. All of them stay in the Client.
      </div>
    </>
  );
}

type Site = [clinic: string, cohort: string, patients: number, answer: string | null];

const sites: Site[] = [
  ['Clinic A', 'Heart failure 2024', 412, 'n = 187'],
  ['Clinic B', 'Cardio registry', 958, 'n = 431'],
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
          same variable in every cohort
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
        One schema, three cohorts. Each cohort answers from its own records under its own disclosure control. Clinic C
        rejects the query: fewer records match than its configured minimum.
      </div>
    </>
  );
}

const modes: ExplainerMode[] = [
  {
    key: 'schema',
    label: 'Schema',
    title: 'A schema describes data; it holds none',
    text: 'A schema is a shared data contract defined on the Platform. It lists the variables a cohort can hold, what each one means, and which values are valid.',
    config: [
      {name: 'Ontology node', text: 'The concept behind a variable, such as body weight or diagnosis.'},
      {name: 'Datatype node', text: 'The value representation and rules, such as FLOAT in kg with MIN and MAX.'},
      {name: 'Schema node', text: 'Arranges variables into groups and marks single-value or list fields.'},
    ],
    note: 'Schemas are created on the Platform. The Client selects an existing schema but cannot create one.',
    scene: SchemaScene,
  },
  {
    key: 'cohort',
    label: 'Cohort',
    title: 'A cohort is a local workspace with data',
    text: 'A cohort is created in the Client and is based on exactly one schema. It holds patient records whose values fit the schema, plus everything needed to manage them.',
    config: [
      {name: 'Schema', text: 'Selected on creation; defines every field its records can hold.'},
      {name: 'Records', text: 'Added through connectors or manual record entry.'},
      {name: 'Settings', text: 'Details, queriability, access management, and members belong to the cohort.'},
    ],
    note: 'Creating a cohort imports no data. Data arrives only when a connector runs or records are entered.',
    scene: CohortScene,
  },
  {
    key: 'shared',
    label: 'One schema, many cohorts',
    title: 'Shared structure, local data',
    text: 'Cohorts in different Clients that use the same schema describe their data the same way. The Platform can address one variable in all of them, while each cohort keeps its own records and rules.',
    config: [
      {name: 'Shared', text: 'The schema: variables, meaning, data types, and validation rules.'},
      {name: 'Local', text: 'The cohort: records, connectors, queriability, and disclosure control.'},
      {name: 'Matching', text: 'Variables are matched by their ontology and datatype nodes, so cohorts on related schemas stay partially comparable.'},
    ],
    note: 'Patient records never leave the Client. Only answers allowed by the cohort’s settings are returned.',
    scene: SharedScene,
  },
];

export default function CohortSchemaAnimation(): ReactNode {
  return <StepExplainer eyebrow="Schema · cohort" accent="map" modes={modes} />;
}
