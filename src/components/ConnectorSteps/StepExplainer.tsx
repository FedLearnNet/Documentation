import {type CSSProperties, type ReactNode, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type ConfigItem = {
  name: string;
  text: ReactNode;
};

export type ExplainerMode = {
  key: string;
  label: string;
  title: string;
  text: ReactNode;
  config?: ConfigItem[];
  examples?: string[];
  note?: ReactNode;
  animated?: boolean;
  scene: () => ReactNode;
};

type Props = {
  eyebrow: string;
  accent: 'extract' | 'transform' | 'map' | 'load';
  modes: ExplainerMode[];
  footer?: ReactNode;
};

/** Delay helper for staged scene animations. */
export const at = (ms: number, extra?: Record<string, string | number>): CSSProperties =>
  ({'--d': `${ms}ms`, ...extra}) as CSSProperties;

/** Value that is replaced by another value at the given time. */
export function Swap({from, to, delay}: {from: ReactNode; to: ReactNode; delay: number}) {
  return (
    <span className={styles.swap}>
      <span className={styles.swapOld} style={at(delay)}>
        {from}
      </span>
      <span className={styles.swapNew} style={at(delay)}>
        {to}
      </span>
    </span>
  );
}

export default function StepExplainer({eyebrow, accent, modes, footer}: Props): ReactNode {
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setStarted(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      {threshold: 0.35},
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const mode = modes[index];

  const select = (next: number) => {
    setIndex(next);
    setStarted(true);
  };

  return (
    <section ref={rootRef} className={clsx(styles.root, !started && styles.paused)} data-accent={accent}>
      <div className={styles.head}>
        <div className={styles.eyebrow}>{eyebrow}</div>
        {mode.animated !== false && <button type="button" className={styles.replay} onClick={() => setRun((r) => r + 1)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
            <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Replay
        </button>}
      </div>

      {modes.length > 1 && (
        <div className={styles.tabs} role="tablist" aria-label={eyebrow}>
          {modes.map((m, i) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={clsx(styles.tab, i === index && styles.tabActive)}
              onClick={() => select(i)}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.body}>
        <div key={`${mode.key}-${run}`} className={styles.stage} aria-hidden>
          {mode.scene()}
        </div>
        <div key={`info-${mode.key}`} className={styles.info}>
          <div className={styles.infoTitle}>{mode.title}</div>
          <p className={styles.infoText}>{mode.text}</p>
          {mode.config && (
            <dl className={styles.config}>
              {mode.config.map((item) => (
                <div key={item.name} className={styles.configRow}>
                  <dt>{item.name}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          )}
          {mode.examples && (
            <div className={styles.examples}>
              <span className={styles.examplesLabel}>Examples</span>
              {mode.examples.map((e) => (
                <span key={e} className={styles.example}>
                  {e}
                </span>
              ))}
            </div>
          )}
          {mode.note && <div className={styles.infoNote}>{mode.note}</div>}
        </div>
      </div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </section>
  );
}
