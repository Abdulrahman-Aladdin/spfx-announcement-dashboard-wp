import * as React from "react";
import styles from "../AnnouncementDashboard.module.scss";

export default function PaginationControls(props: {
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}): React.ReactElement {
  const { pageIndex, setPageIndex, totalPages } = props;

  return (
    <div className={styles.pageControls}>
      <button
        onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
        disabled={pageIndex === 0}
      >
        &lt;&lt;
      </button>
      <span>
        Page {pageIndex + 1} of {totalPages}
      </span>
      <button
        onClick={() =>
          setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
        }
        disabled={pageIndex >= totalPages - 1}
      >
        &gt;&gt;
      </button>
    </div>
  );
}