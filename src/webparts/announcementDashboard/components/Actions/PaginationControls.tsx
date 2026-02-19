import * as React from "react";
import styles from "../AnnouncementDashboard.module.scss";
import { PaginationProps } from "../../utils/types";
import arStrings from "../../loc/ar-sa";
import enStrings from "../../loc/en-us";

export default function PaginationControls(props: PaginationProps): React.ReactElement {
  const { pageIndex, setPageIndex, totalPages, language } = props;

  const strings = language === 'ar' ? arStrings : enStrings;

  return (
    <div className={styles.pageControls}>
      <button
        onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
        disabled={pageIndex === 0}
      >
        &lt;&lt;
      </button>
      <span>
        {strings.pageLabel} {pageIndex + 1} {strings.ofLabel} {totalPages}
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