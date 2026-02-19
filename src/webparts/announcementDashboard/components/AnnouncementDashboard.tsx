import * as React from "react";
import type { IAnnouncementDashboardProps } from "./IAnnouncementDashboardProps";
import { selectAttributes, expandAttributes } from "../utils/constants";
import { AnnouncementItem, FlattenedAnnouncementItem } from "../utils/types";
import FilterComponent from "./Actions/FilterComponent";
import styles from "./AnnouncementDashboard.module.scss";
import TableLayout from "./TableLayout/TableLayout";
import CardLayout from "./CardLayout/CardLayout";
import { formatData } from "../utils/utilFn";
import PaginationControls from "./Actions/PaginationControls";

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
  const [pageIndex, setPageIndex] = React.useState<number>(0);
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
          .top(5000)();

        console.log("Fetched items:", items);

        allItems.current = flattenItems(items);
        setFilteredItems(allItems.current);
      } catch (error) {
        console.error("Error fetching data from SharePoint:", error);
      }
    }

    fetchData().catch((error) => {
      console.error("Error in fetchData:", error);
    });
  }, [listId, sp, language]);

  const getPaged = (): FlattenedAnnouncementItem[] => {
    const start = pageIndex * numberOfItems;
    return filteredItems.slice(start, start + numberOfItems);
  };

  const totalPages = Math.ceil(filteredItems.length / numberOfItems);

  React.useEffect(() => {
    setPageIndex(0);
  }, [numberOfItems, filteredItems]);

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
      <div className={styles.dataContainer}>
        {(layoutStyle === "compact" || layoutStyle === "table") && (
          <TableLayout
            data={getPaged()}
            mode={layoutStyle}
            headerBackgroundColor={headerBackgroundColor}
            headerTextColor={headerTextColor}
          />
        )}
        {layoutStyle === "card" && <CardLayout data={getPaged()} />}
        <PaginationControls
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
}
