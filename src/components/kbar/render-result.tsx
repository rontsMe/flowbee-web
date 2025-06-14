// components/kbar/render-result.tsx
import { KBarResults, useMatches } from 'kbar';
import ResultItem from './result-item';
import styles from './KBarResults.module.css';

export default function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className={styles.sectionHeader}>
            {item}
          </div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId ?? ''}
          />
        )
      }
    />
  );
}