import React from 'react';

interface IProps {
  cellWidth: number;
  cellHeight: number;
  rows?: string[];
}

export default function CalendarColumn(props: IProps) {
  const { cellWidth, cellHeight, rows } = props;

  const cellStyle = {
    border: '0.5px solid black',
    borderColor: 'gray',
    minWidth: cellWidth + 'px',
    minHeight: cellHeight + 'px',
  };

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {rows?.map((row, i) => (
        <div style={cellStyle} key={i}>
          {row}
        </div>
      ))}
    </div>
  );
}
