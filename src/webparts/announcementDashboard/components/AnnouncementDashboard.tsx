import * as React from 'react';
import type { IAnnouncementDashboardProps } from './IAnnouncementDashboardProps';
import { selectAttributes, expandAttributes, listColumns } from '../utils/constants';
import { AnnouncementItem } from '../utils/types';
import { ListActions } from './ListActions';

export default function AnnouncementDashboard(props: IAnnouncementDashboardProps): React.ReactElement<IAnnouncementDashboardProps> {
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
    sp
  } = props;

  const allItems = React.useRef<AnnouncementItem[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<AnnouncementItem[]>([]);

  React.useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const items: AnnouncementItem[] = await sp.web.lists.getById(listId).items.select(...selectAttributes).expand(...expandAttributes).top(numberOfItems)();
        console.log('Items in the list:', items);
        allItems.current = items;
        setFilteredItems(items);
      } catch (error) {
        console.error('Error fetching data from SharePoint:', error);
      }
    }

    fetchData();
  }, [listId, numberOfItems, sp]);

  return (
    <section>
      <h2>{layoutStyle}</h2>
      <ListActions allData={allItems.current} setFilteredItems={setFilteredItems} enableFiltering={enableFiltering} />
      <table>
        <thead style={{ backgroundColor: headerBackgroundColor, color: headerTextColor }}>
          <tr>
            <th>{language === 'ar' ? arTitle : enTitle}</th>
          </tr>
          <tr>
            {listColumns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={index}>
              <td>{item.Title}</td>
              <td>{item.Description}</td>
              <td>{item.Category}</td>
              <td>{item.Priority}</td>
              <td>{item.DueDate}</td>
              <td>{item.AssignedTo ? item.AssignedTo.Title : 'Unassigned'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}