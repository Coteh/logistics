import React from 'react';

interface IProps {
  container: any;
}

export default function Overlay(props: IProps) {
  const { container } = props;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '300px',
          height: '300px',
          backgroundColor: 'grey',
        }}
      >
        {container}
      </div>
    </div>
  );
}
