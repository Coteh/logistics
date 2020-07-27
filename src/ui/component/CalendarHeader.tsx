import React from 'react';

interface IProps {
  cellWidth: number;
  cellHeight: number;
  header?: string;
}

export default function CalendarHeader(props: IProps) {
  const { cellWidth, cellHeight, header } = props;

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
      <div data-testid="cell" style={cellStyle}>
        {header}
      </div>
    </div>
  );
}
