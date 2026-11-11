import {type CSSProperties, type ReactNode, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const STAGE_DURATION_MS = 5200;

type Stage = {
  key: string;
  step: string;
  title: string;
  subtitle: string;
  headline: string;
  purpose: string;
  where: string;
  icon: ReactNode;
};

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const stages: Stage[] = [
  {
    key: 'source',
    step: 'Source',
    title: 'Data source',
    subtitle: 'CSV · Excel · SQL',
    headline: 'Data stays where it already lives',
    purpose:
      'A connector starts at an existing source: a CSV or Excel export, a ZIP archive with several files, or a database queried read-only with an SQL SELECT. The source itself is never modified.',
    where: 'Wizard step 1 · Select the data source',
    icon: (
      <svg {...iconProps}>
        <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
        <path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
        <path d="M5 11.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
      </svg>
    ),
  },
  {
    key: 'extract',
    step: 'Extract',
    title: 'Extractor',
    subtitle: 'reads rows & columns',
    headline: 'Turns any source into one clean table',
    purpose:
      'The extractor interprets the source: delimiter, header row, sheets, or the query result. The output is a single table of named columns and rows. Multiple files or sheets are merged on a shared identifier column.',
    where: 'Wizard steps 2–3 · Configure source, specify headers',
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
        <path d="M3.5 9h17M9.5 9v11" />
      </svg>
    ),
  },
  {
    key: 'transform',
    step: 'Transform',
    title: 'Transformer',
    subtitle: 'built-in & app tools',
    headline: 'Reshapes values to fit the schema',
    purpose:
      'Optional transformations convert the source representation into the one the schema expects: units such as lbs → kg, categories such as m → male, placeholders such as ? → empty, dates, or split columns. Installed app tools add domain-specific steps.',
    where: 'Wizard step 4 · Add transformations',
    icon: (
      <svg {...iconProps}>
        <path d="M4 7h11M4 7l3-3M4 7l3 3" />
        <path d="M20 17H9M20 17l-3-3M20 17l-3 3" />
      </svg>
    ),
  },
  {
    key: 'map',
    step: 'Map',
    title: 'Mapper',
    subtitle: 'schema & validation',
    headline: 'Gives every column its meaning',
    purpose:
      'Each column is linked to a field of the cohort schema, and every value is validated against that field’s data type and rules. An invalid value is rejected on its own; the patient’s other valid values are still imported.',
    where: 'Wizard step 5 · Map source fields to the schema',
    icon: (
      <svg {...iconProps}>
        <circle cx="5.5" cy="6" r="2" />
        <circle cx="5.5" cy="18" r="2" />
        <circle cx="18.5" cy="12" r="2" />
        <path d="M7.5 6c5 0 4 6 9 6M7.5 18c5 0 4-6 9-6" />
      </svg>
    ),
  },
  {
    key: 'load',
    step: 'Load',
    title: 'Cohort',
    subtitle: 'new & updated patients',
    headline: 'Running the connector loads the cohort',
    purpose:
      'A run adds new patients and updates existing ones. A dry run shows the outcome without changing any data, and every run is listed in the activity log with its new, updated, failed, and unchanged patients.',
    where: 'Run · Dry run · Activity log',
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M15.5 14.3c.5-.2 1-.3 1.5-.3 2.2 0 3.8 1.7 4.2 4.5" />
      </svg>
    ),
  },
];

const rawLines = ['PatID;Gender;Weight_lbs;Diag', 'P-001;m;176;I10', 'P-002;f;?;E11.9', 'P-003;F;141;XYZ'];

const sourceRows = [
  ['P-001', 'm', '176', 'I10'],
  ['P-002', 'f', '?', 'E11.9'],
  ['P-003', 'F', '141', 'XYZ'],
];

const transformedRows = [
  ['P-001', 'male', '79.8', 'I10'],
  ['P-002', 'female', '', 'E11.9'],
  ['P-003', 'female', '64.0', 'XYZ'],
];

const sourceHeaders = ['PatID', 'Gender', 'Weight_lbs', 'Diag'];
const transformedHeaders = ['PatID', 'Gender', 'weight_kg', 'Diag'];
const schemaHeaders = ['Patient ID', 'Sex', 'Body weight', 'Diagnosis'];

function DataTable({stage}: {stage: number}) {
  const transformed = stage >= 2;
  const mapped = stage >= 3;
  const headers = transformed ? transformedHeaders : sourceHeaders;
  const rows = transformed ? transformedRows : sourceRows;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header, col) => (
              <th key={col}>
                {mapped ? (
                  <span className={styles.mappedHeader} style={{'--d': `${col * 90}ms`} as CSSProperties}>
                    <span className={styles.mappedFrom}>{header}</span>
                    <span className={styles.mappedTo}>{schemaHeaders[col]}</span>
                  </span>
                ) : (
                  <span className={clsx(transformed && header !== sourceHeaders[col] && styles.changed)}>
                    {header}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => {
                const before = sourceRows[r][c];
                const isChanged = stage === 2 && cell !== before;
                const isInvalid = mapped && c === 3 && cell === 'XYZ';
                return (
                  <td
                    key={c}
                    className={clsx(isChanged && styles.cellChanged, isInvalid && styles.cellInvalid)}
                    style={{'--d': `${(r * 4 + c) * 45}ms`} as CSSProperties}>
                    {isChanged && <s className={styles.before}>{before}</s>}
                    <span>{cell === '' ? <em className={styles.empty}>empty</em> : cell}</span>
                    {mapped && <span className={styles.badge}>{isInvalid ? '✕' : '✓'}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Preview({stage}: {stage: number}) {
  if (stage === 0) {
    return (
      <div className={styles.previewBody}>
        <div className={styles.fileCard}>
          <div className={styles.fileTab}>patients.csv</div>
          <pre className={styles.fileRaw}>
            {rawLines.map((line, i) => (
              <span key={i} style={{'--d': `${i * 120}ms`} as CSSProperties}>
                {line}
                {'\n'}
              </span>
            ))}
          </pre>
        </div>
        <div className={styles.sourceChips}>
          <span>CSV / TSV</span>
          <span>Excel</span>
          <span>ZIP archive</span>
          <span>SQL SELECT</span>
        </div>
      </div>
    );
  }

  if (stage === 4) {
    return (
      <div className={styles.previewBody}>
        <div className={styles.counters}>
          <div className={clsx(styles.counter, styles.counterNew)} style={{'--d': '0ms'} as CSSProperties}>
            <strong>2</strong>
            <span>new patients</span>
          </div>
          <div className={clsx(styles.counter, styles.counterUpdated)} style={{'--d': '120ms'} as CSSProperties}>
            <strong>1</strong>
            <span>updated</span>
          </div>
          <div className={clsx(styles.counter, styles.counterRejected)} style={{'--d': '240ms'} as CSSProperties}>
            <strong>1</strong>
            <span>rejected value</span>
          </div>
        </div>
        <ul className={styles.patients}>
          {transformedRows.map((row, i) => (
            <li key={row[0]} style={{'--d': `${300 + i * 110}ms`} as CSSProperties}>
              <span className={styles.avatar}>{row[0].slice(-1)}</span>
              <span className={styles.patientId}>{row[0]}</span>
              <span className={styles.patientMeta}>
                {row[1]}
                {row[2] ? ` · ${row[2]} kg` : ''}
                {row[3] !== 'XYZ' ? ` · ${row[3]}` : ''}
              </span>
              <span className={clsx(styles.tag, i === 0 ? styles.tagUpdated : styles.tagNew)}>
                {i === 0 ? 'updated' : 'new'}
              </span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          <span className={styles.noteDot} /> “XYZ” is not a valid diagnosis code. Only that value is rejected and listed under
          <b> Patient Errors</b>; the rest of P-003 is imported.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.previewBody}>
      <DataTable stage={stage} />
      {stage === 2 && (
        <div className={styles.ops}>
          <span style={{'--d': '0ms'} as CSSProperties}>m / f → male / female</span>
          <span style={{'--d': '120ms'} as CSSProperties}>lbs → kg</span>
          <span style={{'--d': '240ms'} as CSSProperties}>“?” → empty</span>
        </div>
      )}
      {stage === 3 && (
        <p className={styles.note}>
          <span className={styles.noteDot} /> “XYZ” fails validation for <b>Diagnosis</b>. The value is
          rejected, the patient is not.
        </p>
      )}
    </div>
  );
}

export default function ConnectorAnimation(): ReactNode {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {threshold: 0.35});
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const running = playing && visible && !reducedMotion;

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const timer = window.setTimeout(() => setStage((s) => (s + 1) % stages.length), STAGE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [running, stage]);

  const select = (index: number) => {
    setStage(index);
    setPlaying(false);
  };

  const current = stages[stage];

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, running && styles.running)}
      style={{'--stage-ms': `${STAGE_DURATION_MS}ms`} as CSSProperties}
      data-stage={current.key}>
      <div className={styles.toolbar}>
        <div className={styles.eyebrow}>
          <span className={styles.live} />
          How a connector works
        </div>
        <div className={styles.steps} role="tablist" aria-label="Connector stages">
          {stages.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === stage}
              className={clsx(styles.stepChip, i === stage && styles.stepChipActive, i < stage && styles.stepChipDone)}
              onClick={() => select(i)}>
              <span className={styles.stepNum}>{i + 1}</span>
              {s.step}
              {i === stage && running && <span key={stage} className={styles.stepProgress} />}
            </button>
          ))}
          <button
            type="button"
            className={styles.playButton}
            onClick={() => setPlaying((p) => !p)}
            aria-label={running ? 'Pause animation' : 'Play animation'}
            disabled={reducedMotion}>
            {running ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor" />
                <rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M4 2.5v9l7.5-4.5z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={styles.pipeline}>
        <div className={styles.bracket}>
          <span>Connector · saved, reusable configuration</span>
        </div>
        {stages.map((s, i) => (
          <PipelineItem key={s.key} stage={s} index={i} current={stage} onSelect={select} />
        ))}
      </div>

      <div className={styles.detail}>
        <div key={`text-${stage}`} className={styles.explain}>
          <div className={styles.explainStep}>
            Step {stage + 1} of {stages.length} · {current.title}
          </div>
          <h3 className={styles.explainTitle}>{current.headline}</h3>
          <p className={styles.explainText}>{current.purpose}</p>
          <div className={styles.where}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 9h18" />
            </svg>
            In the Client: {current.where}
          </div>
        </div>
        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span>{['Source file', 'Extracted table', 'Transformed table', 'Mapped & validated', 'Cohort'][stage]}</span>
          </div>
          <div key={`preview-${stage}`} className={styles.previewAnim}>
            <Preview stage={stage} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineItem({
  stage,
  index,
  current,
  onSelect,
}: {
  stage: Stage;
  index: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  const state = index === current ? 'active' : index < current ? 'done' : 'idle';
  return (
    <>
      {index > 0 && (
        <div
          className={clsx(styles.link, index <= current && styles.linkDone, index === current && styles.linkActive)}
          style={{'--pos': index * 2} as CSSProperties}
          aria-hidden>
          <span className={styles.packet} />
          <span className={styles.packet} />
          <span className={styles.packet} />
        </div>
      )}
      <button
        type="button"
        className={clsx(styles.node, styles[`node_${state}`])}
        style={{'--pos': index * 2 + 1} as CSSProperties}
        data-kind={stage.key}
        onClick={() => onSelect(index)}
        aria-label={`${stage.title}: ${stage.headline}`}>
        <span className={styles.nodeIcon}>{stage.icon}</span>
        <span className={styles.nodeText}>
          <span className={styles.nodeTitle}>{stage.title}</span>
          <span className={styles.nodeSub}>{stage.subtitle}</span>
        </span>
      </button>
    </>
  );
}
