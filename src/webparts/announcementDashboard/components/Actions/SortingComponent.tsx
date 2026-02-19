import * as React from "react";
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
    const sortedItems = [...allData].sort(
      (a: FlattenedAnnouncementItem, b: FlattenedAnnouncementItem) => {
        const aValue = (a as Record<string, string>)[selectedColumn] || "";
        const bValue = (b as Record<string, string>)[selectedColumn] || "";
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      },
    );
    setFilteredItems(sortedItems);
  }, [selectedColumn, sortDirection, allData, setFilteredItems]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <label htmlFor="sort-column">Sort by:</label>
      <select
        id="sort-column"
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
      >
        {listColumns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
      <div>
        <label>
          <input
            type="radio"
            name="sort-direction"
            value="asc"
            checked={sortDirection === "asc"}
            onChange={() => setSortDirection("asc")}
          />
          Ascending
        </label>
        <label style={{ marginLeft: "0.5rem" }}>
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
