import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.css';

export type DocLink = {label: string; to: string};

type SlideProps = {
  kicker?: string;
  title?: ReactNode;
  lead?: ReactNode;
  docs?: DocLink[];
  center?: boolean;
  children?: ReactNode;
};

/** One slide. Kicker and docs are read by the deck for its header and footer. */
export function Slide({title, lead, center, children}: SlideProps): ReactNode {
  return (
    <div className={clsx(styles.slide, center && styles.slideCenter)}>
      {title && <div className={styles.title}>{title}</div>}
      {lead && <p className={styles.lead}>{lead}</p>}
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}

const iconProps = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export default function SlideDeck({title, children}: {title: string; children: ReactNode}): ReactNode {
  const slides = Children.toArray(children).filter(isValidElement) as ReactElement<SlideProps>[];
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = useCallback((next: number) => setIndex(Math.max(0, Math.min(count - 1, next))), [count]);

  const toggleFull = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void root.requestFullscreen?.();
      root.focus();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.fullscreenElement !== root && !root.contains(document.activeElement)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        setIndex((i) => Math.min(count - 1, i + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Home') {
        setIndex(0);
      } else if (e.key === 'End') {
        setIndex(count - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFull();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, toggleFull]);

  const slide = slides[index];
  const docs = slide?.props.docs ?? [];

  return (
    <div
      ref={rootRef}
      className={clsx(styles.deck, full && styles.full)}
      tabIndex={0}
      aria-roledescription="slide deck"
      aria-label={title}>
      <div className={styles.bar}>
        <span className={styles.kicker}>{slide?.props.kicker ?? title}</span>
        <span className={styles.barRight}>
          <span className={styles.counter}>
            {index + 1} / {count}
          </span>
          <button type="button" className={styles.iconBtn} onClick={toggleFull} aria-label="Toggle full screen">
            {full ? (
              <svg {...iconProps}>
                <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
              </svg>
            ) : (
              <svg {...iconProps}>
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </svg>
            )}
          </button>
        </span>
      </div>

      <div className={styles.viewport}>
        <div key={index} className={styles.slideWrap} aria-live="polite">
          {slide}
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.navBtn} onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
          ←
        </button>
        <div className={styles.progress}>
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              className={clsx(styles.seg, i <= index && styles.segDone)}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}: ${s.props.kicker ?? ''}`}
            />
          ))}
        </div>
        <div className={styles.docs}>
          {docs.map((doc) => (
            <Link key={doc.to} to={doc.to} target="_blank" className={styles.docLink}>
              {doc.label} ↗
            </Link>
          ))}
        </div>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => go(index + 1)}
          disabled={index === count - 1}
          aria-label="Next slide">
          →
        </button>
      </div>
      {!full && <div className={styles.hint}>Click the deck, then use ← → · F for full screen</div>}
    </div>
  );
}
