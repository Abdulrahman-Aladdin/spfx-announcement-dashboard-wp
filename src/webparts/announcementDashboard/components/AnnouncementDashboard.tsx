import * as React from "react";
import type { IAnnouncementDashboardProps } from "./IAnnouncementDashboardProps";
import {
  selectAttributes,
  expandAttributes,
} from "../utils/constants";
import { AnnouncementItem, FlattenedAnnouncementItem } from "../utils/types";
import FilterComponent from "./FilterComponent";
import styles from "./AnnouncementDashboard.module.scss";
import TableLayout from "./TableLayout";
import CardLayout from "./CardLayout";

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
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
        console.log("Items in the list:", items);
        allItems.current = items.map(
          (item: AnnouncementItem): FlattenedAnnouncementItem => {
            return {
              Title: item.Title || "",
              Description: item.Description || "",
              Category: item.Category || "",
              Priority: item.Priority || "",
              DueDate: formatDate(item.DueDate || ""),
              AssignedTo: item.AssignedTo
                ? item.AssignedTo.Title
                : "Unassigned",
            };
          },
        );
        setFilteredItems(allItems.current);
      } catch (error) {
        console.error("Error fetching data from SharePoint:", error);
      }
    }

    fetchData().catch((error) => {
      console.error("Error in fetchData:", error);
    });
  }, [listId, numberOfItems, sp]);

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
