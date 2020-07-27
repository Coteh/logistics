import React from 'react';

interface IProps {
  message?: string;
  notificationIndex?: number;
}

export default function Notification(props: IProps) {
  const { message, notificationIndex } = props;

  const index: number = notificationIndex || 0;

  if (!message || message === '') {
    return <></>;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: index * 10 + 10 + '%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid grey',
        backgroundColor: 'white',
        padding: '30px 90px',
        zIndex: 500,
      }}
    >
      {message}
    </div>
  );
}
