import React from 'react';

interface IProps {
  message?: string;
}

export default function Notification(props: IProps) {
  const { message } = props;

  if (!message || message === '') {
    return <></>;
  }

  return (
    <div
      style={{
        border: '1px solid grey',
      }}
    >
      {message}
    </div>
  );
}
