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
  setFilteredItems: (items: FlattenedAnnouncementItem[]) => void;
};

export type TableProps = {
  data: FlattenedAnnouncementItem[];
  mode: 'table' | 'compact';
  headerBackgroundColor: string;
  headerTextColor: string;
};

export type CardLayoutProps = {
  data: FlattenedAnnouncementItem[];
};