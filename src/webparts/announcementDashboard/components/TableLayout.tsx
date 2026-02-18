import * as React from "react";
import { TableProps } from "../utils/types";
import { listColumns } from "../utils/constants";
import tableStyles from "./TableLayout.module.scss";

export default function TableLayout(
  props: TableProps,
): React.ReactElement<TableProps> {
  const { data, mode, headerBackgroundColor, headerTextColor } = props;

  if (mode === "compact") {
    return (
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              {listColumns.map((column, index) => (
                <th
                  key={index}
                  className={tableStyles.compactTh}
                  style={{
                    backgroundColor: headerBackgroundColor,
                    color: headerTextColor,
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {listColumns.map((column, colIndex) => (
                  <td
                    key={`${column}-${colIndex}`}
                    className={tableStyles.compactTd}
                  >
                    {(item as Record<string, string>)[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Default: normal table
  return (
    <div className={tableStyles.tableWrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            {listColumns.map((column, index) => (
              <th
                key={index}
                className={tableStyles.th}
                style={{
                  backgroundColor: headerBackgroundColor,
                  color: headerTextColor,
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {listColumns.map((column, colIndex) => (
                <td key={`${column}-${colIndex}`} className={tableStyles.td}>
                  {(item as Record<string, string>)[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
