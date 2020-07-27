import React from 'react';

interface IProps {
  label?: string;
  color?: string;
  onClick?: Function;
}

export default function Button(props: IProps) {
  const { label, onClick } = props;

  return (
    <button
      style={{
        margin: '8px',
        padding: '9px',
        backgroundColor: '#2ca675',
        border: '1px solid #2ca675',
        borderRadius: '5px',
        boxSizing: 'border-box',
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: 700,
        boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
        transition: 'background-color .3s,border-color .3s',
        WebkitTransition: 'background-color .3s,border-color .3s',
        cursor: 'pointer',
      }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {label}
    </button>
  );
}
