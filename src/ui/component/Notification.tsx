import React from 'react';

import styles from './Notification.module.css';

interface IProps {
  message: string;
  notificationIndex?: number;
}

/**
 * Displays a notification on top of the page with supplied message
 * @param props message and (optionally) notification index (used for positioning of notification on page)
 */
export default function Notification(props: IProps) {
  const { message, notificationIndex } = props;

  const index: number = notificationIndex || 0;

  if (!message || message === '') {
    return <></>;
  }

  return (
    <div
      className={styles.notification}
      style={{
        top: index * 10 + 10 + '%',
      }}
    >
      {message}
    </div>
  );
}
