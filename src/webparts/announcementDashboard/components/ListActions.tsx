import * as React from "react";
import { AnnouncementItem } from "../utils/types";
import { listColumns } from "../utils/constants";
import stylesImport from "./AnnouncementDashboard.module.scss";

type ListActionsProps = {
  allData: AnnouncementItem[];
  setFilteredItems: (items: AnnouncementItem[]) => void;
  enableFiltering: boolean;
};

const styles = stylesImport as Record<string, string>;

export function ListActions(props: ListActionsProps): React.ReactElement<ListActionsProps> {
  const { allData, setFilteredItems, enableFiltering } = props;

  type ColumnKey = "Title" | "Description" | "Category" | "Priority" | "DueDate" | "AssignedTo";
  const columns = listColumns as ColumnKey[];

  const emptySelections = React.useCallback((): Record<ColumnKey, string[]> => {
    return columns.reduce((acc, column) => {
      acc[column] = [];
      return acc;
    }, {} as Record<ColumnKey, string[]>);
  }, [columns]);

  const [openColumn, setOpenColumn] = React.useState<ColumnKey | null>(null);
  const [pendingSelections, setPendingSelections] = React.useState<Record<ColumnKey, string[]>>(emptySelections);

  const formatDueDate = React.useCallback((value: string): string => {
    if (!value) {
      return "No Due Date";
    }

    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString();
  }, []);

  const getValueForColumn = React.useCallback(
    (column: ColumnKey, item: AnnouncementItem): string => {
      switch (column) {
        case "AssignedTo":
          return item.AssignedTo?.Title || "Unassigned";
        case "DueDate":
          return formatDueDate(item.DueDate);
        case "Title":
          return item.Title || "Empty";
        case "Description":
          return item.Description || "Empty";
        case "Category":
          return item.Category || "Empty";
        case "Priority":
          return item.Priority || "Empty";
        default:
          return "Empty";
      }
    },
    [formatDueDate]
  );

  const uniqueValuesByColumn = React.useMemo(() => {
    const result = columns.reduce((acc, column) => {
      acc[column] = new Set<string>();
      return acc;
    }, {} as Record<ColumnKey, Set<string>>);

    allData.forEach((item) => {
      columns.forEach((column) => {
        result[column].add(getValueForColumn(column, item));
      });
    });

    const normalizeSort = (value: string): [number, string] => {
      if (value === "Unassigned" || value === "No Due Date" || value === "Empty") {
        return [1, value];
      }

      return [0, value];
    };

    return columns.reduce((acc, column) => {
      const values: string[] = [];
      result[column].forEach((value) => {
        values.push(value);
      });
      values.sort((left: string, right: string) => {
        const [leftRank, leftValue] = normalizeSort(left);
        const [rightRank, rightValue] = normalizeSort(right);

        if (leftRank !== rightRank) {
          return leftRank - rightRank;
        }

        return leftValue.localeCompare(rightValue);
      });
      acc[column] = values;
      return acc;
    }, {} as Record<ColumnKey, string[]>);
  }, [allData, columns, getValueForColumn]);

  React.useEffect(() => {
    setPendingSelections((prev) => {
      const next = { ...prev } as Record<ColumnKey, string[]>;
      columns.forEach((column) => {
        const available = new Set(uniqueValuesByColumn[column]);
        next[column] = prev[column].filter((value) => available.has(value));
      });
      return next;
    });
  }, [columns, uniqueValuesByColumn]);

  const toggleSelection = (column: ColumnKey, value: string): void => {
    setPendingSelections((prev) => {
      const current = prev[column];
      const exists = current.indexOf(value) >= 0;
      const nextValues = exists ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [column]: nextValues };
    });
  };

  const clearColumn = (column: ColumnKey): void => {
    setPendingSelections((prev) => ({ ...prev, [column]: [] }));
  };

  const applyFilters = (): void => {
    const nextItems = allData.filter((item) => {
      return columns.every((column) => {
        const selected = pendingSelections[column];
        if (!selected.length) {
          return true;
        }

        const value = getValueForColumn(column, item);
        return selected.indexOf(value) >= 0;
      });
    });

    setFilteredItems(nextItems);
  };

  const clearAll = (): void => {
    const next = emptySelections();
    setPendingSelections(next);
    setFilteredItems(allData);
  };

  if (!enableFiltering) {
    return <></>;
  }

  return (
    <div className={styles.listActions}>
      <div className={styles.filtersRow}>
        {columns.map((column) => (
          <div key={column} className={styles.filterColumn}>
            <button
              type="button"
              className={styles.filterButton}
              onClick={() => setOpenColumn((current) => (current === column ? null : column))}
              aria-expanded={openColumn === column}
            >
              {column}
              {pendingSelections[column].length > 0 ? ` (${pendingSelections[column].length})` : ""}
            </button>
            {openColumn === column && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <span>{column}</span>
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => clearColumn(column)}
                  >
                    Clear
                  </button>
                </div>
                <div className={styles.dropdownBody}>
                  {uniqueValuesByColumn[column].map((value, index) => {
                    const id = `${column}-${index}`;
                    return (
                      <label key={id} className={styles.option} htmlFor={id}>
                        <input
                          id={id}
                          type="checkbox"
                          checked={pendingSelections[column].indexOf(value) >= 0}
                          onChange={() => toggleSelection(column, value)}
                        />
                        <span>{value}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.actionsRow}>
        <button type="button" className={styles.actionButton} onClick={applyFilters}>
          Apply
        </button>
        <button type="button" className={styles.clearAllButton} onClick={clearAll}>
          Clear All
        </button>
      </div>
    </div>
  );
}