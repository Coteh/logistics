import React from 'react';

interface IProps {
  cellWidth: number;
  cellHeight: number;
  rows?: string[];
}

/**
 * Represents a column on the calendar
 * @param props cell width and height, and optional rows
 */
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
        <div data-testid="cell" style={cellStyle} key={i}>
          {row}
        </div>
      ))}
    </div>
  );
}
