import * as React from "react";
import type { IAnnouncementDashboardProps } from "./IAnnouncementDashboardProps";
import { selectAttributes, expandAttributes } from "../utils/constants";
import { AnnouncementItem, FlattenedAnnouncementItem } from "../utils/types";
import FilterComponent from "./Actions/FilterComponent";
import styles from "./AnnouncementDashboard.module.scss";
import TableLayout from "./TableLayout/TableLayout";
import CardLayout from "./CardLayout/CardLayout";
import { formatData } from "../utils/utilFn";

export default function AnnouncementDashboard(
  props: IAnnouncementDashboardProps,
): React.ReactElement<IAnnouncementDashboardProps> {
  const {
    enTitle,
    arTitle,
    listId,
    layoutStyle,
    enableFiltering,
    numberOfItems,
    language,
    headerBackgroundColor,
    headerTextColor,
    sp,
  } = props;

  const allItems = React.useRef<FlattenedAnnouncementItem[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<
    FlattenedAnnouncementItem[]
  >([]);

  const flattenItems = (
    items: AnnouncementItem[],
  ): FlattenedAnnouncementItem[] => {
    return items.map((item: AnnouncementItem): FlattenedAnnouncementItem => {
      return {
        Title: item.Title || "",
        Description: item.Description || "",
        Category: item.Category || "",
        Priority: item.Priority || "",
        DueDate: formatData(item.DueDate || "", language),
        AssignedTo: item.AssignedTo ? item.AssignedTo.Title : "Unassigned",
      };
    });
  };

  React.useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const items: AnnouncementItem[] = await sp.web.lists
          .getById(listId)
          .items.select(...selectAttributes)
          .expand(...expandAttributes)
          .top(numberOfItems)();

        allItems.current = flattenItems(items);
      } catch (error) {
        console.error("Error fetching data from SharePoint:", error);
      }
    }

    fetchData().catch((error) => {
      console.error("Error in fetchData:", error);
    });
  }, [listId, numberOfItems, sp, language]);

  return (
    <section>
      <div
        className={styles.wpTitle}
        style={{
          backgroundColor: headerBackgroundColor,
          color: headerTextColor,
        }}
      >
        {language === "ar" ? arTitle : enTitle}
      </div>
      {enableFiltering && (
        <FilterComponent
          allData={allItems.current}
          setFilteredItems={setFilteredItems}
        />
      )}
      {(layoutStyle === "compact" || layoutStyle === "table") && (
        <TableLayout
          data={filteredItems}
          mode={layoutStyle}
          headerBackgroundColor={headerBackgroundColor}
          headerTextColor={headerTextColor}
        />
      )}
      {layoutStyle === "card" && <CardLayout data={filteredItems} />}
    </section>
  );
}
