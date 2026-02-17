import * as React from 'react';
import type { IAnnouncementDashboardProps } from './IAnnouncementDashboardProps';
import styles from './AnnouncementDashboard.module.scss';

const selectAttributes: string[] = ['Title', 'Description', 'Category', 'Priority', 'DueDate', 'AssignedTo/Title'];
const expandAttributes: string[] = ['AssignedTo'];

type AnnouncementItem = {
  Title: string;
  Description: string;
  Category: string;
  Priority: string;
  DueDate: string;
  AssignedTo: {
    Title: string;
  } | null;
};

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

  const [items, setItems] = React.useState<AnnouncementItem[]>([]);


  React.useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const items: AnnouncementItem[] = await sp.web.lists.getById(listId).items.select(...selectAttributes).expand(...expandAttributes).top(numberOfItems)();
        console.log('Items in the list:', items);
        setItems(items);
      } catch (error) {
        console.error('Error fetching data from SharePoint:', error);
      }
    }

    fetchData();
  }, [listId, numberOfItems, sp]);

  return (
    <section>
      <h2
        style={{ backgroundColor: headerBackgroundColor, color: headerTextColor }}
        className={styles.header}
      >
        {language === 'ar' ? arTitle : enTitle}
      </h2>
      <p>List Id: {listId}</p>
      <p>Layout Style: {layoutStyle}</p>
      <p>Enable Filtering: {enableFiltering ? 'Yes' : 'No'}</p>
      <p>Number of Items: {numberOfItems}</p>
      <p>Language: {language}</p>
      <p>Header Background Color: {headerBackgroundColor}</p>
      <p>Header Text Color: {headerTextColor}</p>
      { items.length > 0 && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <strong>{item.Title}</strong><br />
              {item.Description}<br />
              Category: {item.Category}<br />
              Priority: {item.Priority}<br />
              Due Date: {item.DueDate ? new Date(item.DueDate).toLocaleDateString() : 'N/A'}<br />
              Assigned To: {item.AssignedTo ? item.AssignedTo.Title : 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}