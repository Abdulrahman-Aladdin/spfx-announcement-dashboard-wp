export type AnnouncementItem = {
  Title: string;
  Description: string;
  Category: string;
  Priority: string;
  DueDate: string;
  AssignedTo: {
    Title: string;
  } | undefined;
};

export type FlattenedAnnouncementItem = {
  Title: string;
  Description: string;
  Category: string;
  Priority: string;
  DueDate: string;
  AssignedTo: string;
};

export type ListActionsProps = {
  allData: FlattenedAnnouncementItem[];
  language: string;
  setFilteredItems: (items: FlattenedAnnouncementItem[]) => void;
};

export type TableProps = {
  data: FlattenedAnnouncementItem[];
  mode: 'table' | 'compact';
  headerBackgroundColor: string;
  headerTextColor: string;
  language: string;
};

export type CardLayoutProps = {
  data: FlattenedAnnouncementItem[];
};

export type SortingComponentProps = {
  allData: FlattenedAnnouncementItem[];
  language: string;
  setFilteredItems: (items: FlattenedAnnouncementItem[]) => void;
};

export type PaginationProps = {
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  language: string;
}