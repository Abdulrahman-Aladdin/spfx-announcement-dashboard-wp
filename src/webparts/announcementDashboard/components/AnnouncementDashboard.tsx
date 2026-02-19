import * as React from "react";
import type { IAnnouncementDashboardProps } from "./IAnnouncementDashboardProps";
import { selectAttributes, expandAttributes } from "../utils/constants";
import { AnnouncementItem, FlattenedAnnouncementItem } from "../utils/types";
import FilterComponent from "./Actions/FilterComponent";
import styles from "./AnnouncementDashboard.module.scss";
import TableLayout from "./TableLayout/TableLayout";
import CardLayout from "./CardLayout/CardLayout";
import { flattenItems } from "../utils/utilFn";
import PaginationControls from "./Actions/PaginationControls";
import SortingComponent from "./Actions/SortingComponent";

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
  const [dataToDisplay, setDataToDisplay] = React.useState<FlattenedAnnouncementItem[]>([]);

  React.useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const items: AnnouncementItem[] = await sp.web.lists
          .getById(listId)
          .items.select(...selectAttributes)
          .expand(...expandAttributes)
          .top(5000)();

        allItems.current = flattenItems(items, language);
        setFilteredItems(allItems.current);
        setDataToDisplay(allItems.current);
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
    return dataToDisplay.slice(start, start + numberOfItems);
  };

  const totalPages = Math.ceil(dataToDisplay.length / numberOfItems);

  React.useEffect(() => {
    setPageIndex(0);
  }, [numberOfItems, dataToDisplay]);

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
      <SortingComponent allData={filteredItems} setFilteredItems={setDataToDisplay} />
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
