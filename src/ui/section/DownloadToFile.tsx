import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Button from '../component/Button';
import { getNumberInputFromString } from '../../util/input_util';

const DAY_INTERVALS = [2, 4, 7, 14, 28];

interface IProps {
  userID: number;
  defaultInterval?: number;
  submitFunc: Function;
}

/**
 * Prompt for generating and downloading spreadsheet report
 * @param props user id, default interval, and submit function
 */
export default function DownloadToFile(props: IProps) {
  const { userID, defaultInterval, submitFunc } = props;

  const [interval, setInterval] = useState(defaultInterval || 0);

  const app = useContext(AppContext);

  function onSubmit() {
    if (!DAY_INTERVALS.includes(interval)) {
      app.displayNotification('Please select a valid day interval');
      return;
    }
    submitFunc(userID, interval);
  }

  return (
    <div
      style={{
        margin: '0 auto',
      }}
    >
      <h2>Download Report</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <table
          style={{
            textAlign: 'left',
            margin: '0 auto',
          }}
        >
          <tbody>
            <tr>
              <td>
                <label>Day Interval</label>
              </td>
              <td>
                <select
                  name="interval"
                  data-testid="interval"
                  value={interval}
                  onChange={(e) =>
                    setInterval(getNumberInputFromString(e.target.value))
                  }
                >
                  {DAY_INTERVALS.map((n, i) => (
                    <option key={`interval_option_${i}`} value={n}>
                      {n} days
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <Button onClick={onSubmit} label="Submit"></Button>
      </form>
    </div>
  );
}
