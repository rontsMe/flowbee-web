import { TopNav } from "../TopNav/TopNav";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import styles from "./TopStack.module.css";

export function TopStack() {
  return (
    <div className={styles.topStack}>
      <TopNav />
      <Breadcrumbs />
    </div>
  );
}
