import React from 'react';

import styles from './Button.module.scss';

interface IProps {
  label?: string;
  onClick?: Function;
}

/**
 * Displays a button that user can press
 * @param props label of button, as well as onClick function (all optional)
 */
export default function Button(props: IProps) {
  const { label, onClick } = props;

  return (
    <button
      className={styles.button}
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
