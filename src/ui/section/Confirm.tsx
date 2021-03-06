import React from 'react';
import Button from '../component/Button';

interface IProps {
  label: string;
  yesFunc: Function;
  noFunc: Function;
}

/**
 * Confirmation dialog
 * @param props label and yes/no callbacks
 */
export default function Confirm(props: IProps) {
  const { label, yesFunc, noFunc } = props;

  return (
    <div>
      {label}
      <br />
      <Button onClick={() => yesFunc()} label="Yes"></Button>
      <Button onClick={() => noFunc()} label="No"></Button>
    </div>
  );
}
