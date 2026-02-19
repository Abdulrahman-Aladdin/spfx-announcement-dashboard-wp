import * as React from "react";
import { FlattenedAnnouncementItem, ListActionsProps } from "../../utils/types";
import { listColumns } from "../../utils/constants";
import styles from "../AnnouncementDashboard.module.scss";
import arStrings from "../../loc/ar-sa";
import enStrings from "../../loc/en-us";

export default function FilterComponent(
  props: ListActionsProps,
): React.ReactElement<ListActionsProps> {
  const { allData, setFilteredItems, language } = props;

  const [filter, setFilter] = React.useState<Record<string, Set<string>>>({});
  const [openColumn, setOpenColumn] = React.useState<string | null>(null);

  const strings = language === 'ar' ? arStrings : enStrings;

  const uniqueValues = React.useMemo(() => {
    const result: Record<string, Set<string>> = {};
    listColumns.forEach((column: string) => {
      result[column] = new Set<string>();
      allData.forEach((item: FlattenedAnnouncementItem) => {
        const value = (item as Record<string, string>)[column] || "Empty";
        result[column].add(value);
      });
    });

    listColumns.forEach((column: string) => {
      result[column] = new Set(Array.from(result[column]).sort());
    });

    return result;
  }, [allData]);

  const filterData = React.useMemo(() => {
    return allData.filter((item: FlattenedAnnouncementItem) => {
      return listColumns.every((column: string) => {
        if (!filter[column] || filter[column].size === 0) {
          return true;
        }
        const value = (item as Record<string, string>)[column] || "Empty";
        return filter[column].has(value);
      });
    });
  }, [allData, filter]);

  React.useEffect(() => {
    setFilteredItems(filterData);
  }, [filterData]);

  const toggleFilter = (column: string, value: string): void => {
    setFilter((prev) => {
      let newSet = prev[column];

      if (!newSet) {
        newSet = new Set<string>();
      }

      if (newSet.has(value)) newSet.delete(value);
      else newSet.add(value);

      return {
        ...prev,
        [column]: newSet,
      };
    });
  };

  const toggleColumn = (column: string): void => {
    setOpenColumn((prev) => (prev === column ? null : column));
  };

  return (
    <>
      <h3>{strings.filterByColumn}</h3>
      <section className={styles.filterSection}>
        {listColumns.map((column: string, index: number) => (
          <div key={column} className={styles.filterField}>
            <button
              className={`${styles.filterButton} ${openColumn === column ? styles.active : ""}`}
              onClick={() => toggleColumn(column)}
            >
              <span>{strings.locListColumns[index]}</span>
              <span>({filter[column]?.size || 0})</span>
            </button>
            {openColumn === column && (
              <div className={styles.filterDropdown}>
                {Array.from(uniqueValues[column]).map((value: string) => (
                  <label key={value}>
                    <input
                      type="checkbox"
                      checked={filter[column]?.has(value) || false}
                      onChange={() => toggleFilter(column, value)}
                    />
                    {value}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <button className={styles.clearAllButton} onClick={() => setFilter({})}>
          {strings.clearAllFilters}
        </button>
      </section>
    </>
  );
}
