import React from 'react';

import styles from './CalendarEntry.module.css';

interface IProps {
  label: string;
  startY: number;
  height: number;
  onClick?: Function;
}

export default function CalendarEntry(props: IProps) {
  const { label, startY, height, onClick } = props;

  return (
    <div
      style={{
        top: startY + 'px',
        height: height + 'px',
      }}
      className={styles.calendarEntry}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <span className={styles.calendarEntryText}>{label}</span>
    </div>
  );
}
