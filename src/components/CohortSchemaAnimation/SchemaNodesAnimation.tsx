import type {ReactNode} from 'react';
import clsx from 'clsx';
import StepExplainer, {at, type ExplainerMode} from '../ConnectorSteps/StepExplainer';
import s from '../ConnectorSteps/styles.module.css';
import c from './styles.module.css';

function OntologyScene() {
  const fields: [string, string][] = [
    ['US-130', 'Weight'],
    ['Cardio', 'Body weight'],
    ['Registry', 'Gewicht'],
  ];
  return (
    <>
      <span className={s.label}>Schema nodes in three schemas</span>
      <div className={c.trio}>
        {fields.map(([schema, name], i) => (
          <div key={schema} className={clsx(s.card, s.in)} style={at(100 + i * 200)}>
            <div className={s.cardHead}>{schema}</div>
            <div className={c.site}>
              <span className={c.siteName}>{name}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={c.fanout} aria-hidden>
        {['16.5%', '50%', '83.5%'].map((x, i) => (
          <span key={x} className={s.fade} style={at(1000 + i * 150, {'--x': x})} />
        ))}
      </div>
      <div className={s.center}>
        <div className={clsx(s.fn, s.pop)} style={at(1600)}>
          <span style={{fontSize: '0.86rem', fontWeight: 650}}>◎ Body Weight</span>
          <span className={s.fnParams}>ontology node · one global ID</span>
        </div>
      </div>
      <div className={clsx(s.caption, s.fade)} style={{...at(2400), textAlign: 'center'}}>
        Three names, one meaning.
      </div>
    </>
  );
}

type Check = [value: string, ok: boolean, reason: string];

function DatatypeScene() {
  const checks: Check[] = [
    ['79.8', true, 'valid'],
    ['heavy', false, 'not a FLOAT'],
    ['812', false, 'above MAX'],
  ];
  const brackets = ['[50-75)', '[75-100)', '[100-125)', '…'];
  return (
    <>
      <div className={clsx(s.card, s.in)} style={at(100)}>
        <div className={s.cardHead}>
          <span>Datatype · Body weight in kg</span>
          <span className={s.tag}>FLOAT</span>
        </div>
        <div className={s.row} style={{padding: '0.45rem 0.6rem'}}>
          <span className={clsx(s.chip, s.pop)} style={at(500)}>MIN 0</span>
          <span className={clsx(s.chip, s.pop)} style={at(650)}>MAX 400</span>
        </div>
        <table className={s.tbl}>
          <tbody>
            {checks.map(([value, ok, reason], i) => (
              <tr key={value} className={s.slideL} style={at(1000 + i * 450)}>
                <td>{value}</td>
                <td style={{width: '100%'}}>
                  <span className={clsx(ok ? s.ok : s.err, s.pop)} style={at(1250 + i * 450)}>
                    {ok ? '✓' : '✕'}
                  </span>{' '}
                  <span className={s.caption}>{reason}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={clsx(s.card, s.in)} style={at(2600)}>
        <div className={s.cardHead}>
          <span>Datatype · Weight bracket</span>
          <span className={s.tag}>CATEGORICAL</span>
        </div>
        <div className={s.row} style={{padding: '0.45rem 0.6rem'}}>
          {brackets.map((b, i) => (
            <span key={b} className={clsx(s.chip, s.chipAccent, s.mono, s.pop)} style={at(2900 + i * 120)}>
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className={clsx(s.caption, s.fade)} style={at(3500)}>
        Same concept, two representations.
      </div>
    </>
  );
}

type TreeNode = [name: string, depth: number, kind: string, value?: string];

function SchemaNodeScene() {
  const tree: TreeNode[] = [
    ['Patient', 0, 'root'],
    ['Measurements', 1, 'group'],
    ['Body weight', 2, 'single', '79.8'],
    ['Diagnoses', 1, 'list', 'I10 · E11.9'],
  ];
  return (
    <>
      <div className={s.row}>
        <span className={clsx(s.chip, s.chipAccent, s.pop)} style={at(100)}>◎ Body Weight</span>
        <span className={clsx(s.arrowRight, s.fade)} style={at(300)}>+</span>
        <span className={clsx(s.chip, s.pop)} style={at(400)}>
          <b>FLOAT</b> · kg · 0–400
        </span>
        <span className={clsx(s.arrowRight, s.fade)} style={at(700)}>→</span>
        <span className={clsx(s.field, s.pop)} style={at(900)}>Body weight</span>
      </div>
      <div className={clsx(s.card, s.in)} style={at(1300)}>
        <div className={s.cardHead}>
          <span>Schema · Cardio</span>
          <span>P-001</span>
        </div>
        <div className={c.tree}>
          {tree.map(([name, depth, kind, value], i) => (
            <div key={name} className={clsx(c.node, s.slideL)} style={at(1600 + i * 300, {'--depth': depth})}>
              <span className={clsx(c.nodeName, !value && c.nodeGroup)}>{name}</span>
              {value ? (
                <span className={clsx(s.chip, s.mono, s.pop)} style={at(3000 + i * 250)}>
                  {value}
                </span>
              ) : (
                <span />
              )}
              <span className={clsx(s.tag, !value && s.tagMuted)}>{kind}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={clsx(s.caption, s.fade)} style={at(3800)}>
        A single field holds one value per patient; a list field holds several.
      </div>
    </>
  );
}

const modes: ExplainerMode[] = [
  {
    key: 'ontology',
    label: 'Ontology',
    title: 'What a value means',
    text: 'An ontology node names a medical concept. Fields with the same ontology node mean the same thing, whatever they are called.',
    examples: ['SNOMED CT', 'LOINC', 'ICD-10', 'RxNorm'],
    scene: OntologyScene,
  },
  {
    key: 'datatype',
    label: 'Datatype',
    title: 'How a value looks',
    text: 'A datatype node sets the value type and the rules every value must pass.',
    config: [
      {name: 'Type', text: 'INT, FLOAT, BOOLEAN, STRING, DATE, DATE_TIME, CATEGORICAL, FILE'},
      {name: 'Rules', text: 'MIN, MAX, MINLENGTH, MAXLENGTH, PATTERN, required'},
      {name: 'Options', text: 'Allowed categories of a CATEGORICAL type'},
    ],
    scene: DatatypeScene,
  },
  {
    key: 'schema',
    label: 'Schema node',
    title: 'Where a value goes',
    text: 'A schema node joins one ontology node and one datatype node into a field and places it in the schema tree.',
    config: [
      {name: 'Group', text: 'Organizes fields; holds no value'},
      {name: 'Single', text: 'One value per patient'},
      {name: 'List', text: 'Several values per patient'},
    ],
    scene: SchemaNodeScene,
  },
];

export default function SchemaNodesAnimation(): ReactNode {
  return <StepExplainer eyebrow="Schema building blocks" accent="map" modes={modes} />;
}
