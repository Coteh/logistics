import React, { useContext } from 'react';
import Button from './Button';
import { AppContext } from '../App';

interface IProps {
  container: any;
}

export default function Overlay(props: IProps) {
  const { container } = props;

  const app = useContext(AppContext);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '16px',
        zIndex: 500,
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
          <Button onClick={app.closeOverlay} label="X"></Button>
        </div>
        {container}
      </div>
    </div>
  );
}
