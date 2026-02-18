import * as React from "react";
import { CardLayoutProps } from "../utils/types";
import styles from "./CardLayout.module.scss";

export default function CardLayout(
  props: CardLayoutProps,
): React.ReactElement<CardLayoutProps> {
  const { data } = props;
  return (
    <div className={styles.cardGrid}>
      {data.map((item, idx) => (
        <div className={styles.card} key={idx}>
          <div className={styles.cardTitle}>{item.Title}</div>
          <div className={styles.cardMeta}>
            <span>Category: {item.Category}</span> |{" "}
            <span>Priority: {item.Priority}</span>
          </div>
          <div className={styles.cardMeta}>
            <span>Due: {item.DueDate}</span> |{" "}
            <span>Assigned: {item.AssignedTo}</span>
          </div>
          <div className={styles.cardDescription}>{item.Description}</div>
          <div className={styles.cardFooter}>Announcement</div>
        </div>
      ))}
    </div>
  );
}
