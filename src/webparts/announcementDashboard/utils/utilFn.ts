import { AnnouncementItem, FlattenedAnnouncementItem } from "./types";

export const formatData = (dateString: string, language: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const flattenItems = (
  items: AnnouncementItem[],
  language: string
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