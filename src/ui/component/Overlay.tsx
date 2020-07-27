import React, { useContext, Fragment } from 'react';
import Button from './Button';
import { AppContext } from '../../App';

interface IProps {
  container: JSX.Element;
  contextMenuItems?: JSX.Element[];
}

export default function Overlay(props: IProps) {
  const { container, contextMenuItems } = props;

  const app = useContext(AppContext);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '16px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '300px',
          height: '300px',
          backgroundColor: 'white',
          borderRadius: '5px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '5%',
            right: '5%',
          }}
        >
          {contextMenuItems?.map((menuItem, i) => (
            <Fragment key={`menu_item_${i}`}>{menuItem}</Fragment>
          ))}
          <Button onClick={app.closeOverlay} label="X"></Button>
        </div>
        {container}
      </div>
    </div>
  );
}
