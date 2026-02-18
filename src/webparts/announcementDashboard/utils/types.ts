export type AnnouncementItem = {
  Title: string;
  Description: string;
  Category: string;
  Priority: string;
  DueDate: string;
  AssignedTo: {
    Title: string;
  } | null;
};