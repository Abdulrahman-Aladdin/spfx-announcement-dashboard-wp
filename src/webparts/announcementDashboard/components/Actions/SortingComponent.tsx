import * as React from "react";
import styles from "./SortingComponent.module.scss";
import {
  FlattenedAnnouncementItem,
  SortingComponentProps,
} from "../../utils/types";
import { listColumns } from "../../utils/constants";

export default function SortingComponent(
  props: SortingComponentProps,
): React.ReactElement<SortingComponentProps> {
  const { allData, setFilteredItems } = props;

  const [selectedColumn, setSelectedColumn] = React.useState<string>(
    listColumns[0],
  );
  
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc",
  );

  React.useEffect(() => {
    const priorityOrder: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    const sortedItems = [...allData].sort(
      (a: FlattenedAnnouncementItem, b: FlattenedAnnouncementItem) => {
        let aValue = (a as Record<string, string>)[selectedColumn] || "";
        let bValue = (b as Record<string, string>)[selectedColumn] || "";

        if (selectedColumn === "DueDate") {
          const aDate = aValue ? new Date(aValue).getTime() : 0;
          const bDate = bValue ? new Date(bValue).getTime() : 0;
          if (aDate < bDate) return sortDirection === "asc" ? -1 : 1;
          if (aDate > bDate) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }

        if (selectedColumn === "Priority") {
          const aPriority = priorityOrder[aValue.toLowerCase()] || 0;
          const bPriority = priorityOrder[bValue.toLowerCase()] || 0;
          if (aPriority < bPriority) return sortDirection === "asc" ? -1 : 1;
          if (aPriority > bPriority) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      },
    );
    setFilteredItems(sortedItems);
  }, [selectedColumn, sortDirection, allData]);

  return (
    <div className={styles.sortingComponent}>
      <label htmlFor="sort-column" className={styles.sortLabel}>
        Sort by:
      </label>
      <select
        id="sort-column"
        className={styles.sortSelect}
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
      >
        {listColumns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
      <div className={styles.sortDirection}>
        <label className={styles.sortRadioLabel}>
          <input
            type="radio"
            name="sort-direction"
            value="asc"
            checked={sortDirection === "asc"}
            onChange={() => setSortDirection("asc")}
          />
          Ascending
        </label>
        <label className={styles.sortRadioLabel}>
          <input
            type="radio"
            name="sort-direction"
            value="desc"
            checked={sortDirection === "desc"}
            onChange={() => setSortDirection("desc")}
          />
          Descending
        </label>
      </div>
    </div>
  );
}
