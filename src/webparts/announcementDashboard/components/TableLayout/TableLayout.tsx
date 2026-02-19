import * as React from "react";
import { TableProps } from "../../utils/types";
import { listColumns } from "../../utils/constants";
import tableStyles from "../TableLayout.module.scss";

export default function TableLayout(
  props: TableProps,
): React.ReactElement<TableProps> {
  const { data, mode, headerBackgroundColor, headerTextColor } = props;

  const thStyle = mode === 'compact' ? tableStyles.compactTh : tableStyles.th;
  const tdStyle = mode === 'compact' ? tableStyles.compactTd : tableStyles.td;

  return (
    <div className={tableStyles.tableWrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            {listColumns.map((column, index) => (
              <th
                key={index}
                className={thStyle}
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
                <td key={`${column}-${colIndex}`} className={tdStyle}>
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
