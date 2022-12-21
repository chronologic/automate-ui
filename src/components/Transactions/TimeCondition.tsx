import { useCallback, useState } from 'react';
import { DatePicker, Select, TimePicker } from 'antd';
import moment from 'moment-timezone';

interface IProps {
  editing: boolean;
  canEdit: boolean;
  timeCondition: number;
  timeConditionTZ: string;
  onChange: ({ timeCondition, timeConditionTZ }: { timeCondition: number; timeConditionTZ: string }) => void;
}

const defaultValues = {
  timeCondition: 0,
  timeConditionTZ: '',
};

const tzGuess = moment.tz.guess();

function TimeCondition({ editing, canEdit, timeCondition, timeConditionTZ, onChange }: IProps) {
  // eslint-disable-next-line eqeqeq
  const hasTimeCondition = timeCondition && timeCondition != 0;
  const timeConditionLocal = hasTimeCondition ? moment(timeCondition) : '';
  const timeConditionForTz = hasTimeCondition ? (timeConditionLocal as any).clone().tz(timeConditionTZ) : '';
  const timeConditionTime = timeConditionForTz || moment().startOf('day');

  console.log({ timeConditionTZ, tzGuess });

  const [editedDate, setEditedDate] = useState<moment.Moment>(timeConditionForTz);
  const [editedTime, setEditedTime] = useState<moment.Moment>(timeConditionForTz);
  const [editedTz, setEditedTz] = useState(timeConditionTZ || tzGuess);

  const handleDateChange = useCallback(
    (date) => {
      setEditedDate(date);
      if (!date || !editedTz) {
        console.log('DATE EMPTY');
        onChange(defaultValues);
      } else {
        console.log('DATE CALC');
        const dateStr = moment(date).format('YYYY.MM.DD');
        const timeStr = editedTime ? moment(editedTime).format('HH:mm') : '12:00';
        const newDate = moment.tz(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm', editedTz).toDate().getTime();
        onChange({ timeCondition: newDate, timeConditionTZ: editedTz });
      }
    },
    [editedTime, editedTz, onChange]
  );

  const handleTimeChange = useCallback(
    (time) => {
      setEditedTime(time);
      if (!time || !editedDate || !editedTz) {
        onChange(defaultValues);
      } else {
        const timeStr = moment(time).format('HH:mm');
        const dateStr = moment(editedDate).format('YYYY.MM.DD');
        const newDate = moment.tz(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm', editedTz).toDate().getTime();
        onChange({ timeCondition: newDate, timeConditionTZ: editedTz });
      }
    },
    [editedDate, editedTz, onChange]
  );

  const handleTimeConditionTZChange = useCallback(
    (tz) => {
      setEditedTz(tz);
      if (!editedDate || !editedTime || !editedTz) {
        onChange(defaultValues);
      } else {
        const timeStr = moment(editedTime).format('HH:mm');
        const dateStr = moment(editedDate).format('YYYY.MM.DD');
        const newDate = moment.tz(`${dateStr} ${timeStr}`, 'YYYY.MM.DD HH:mm', tz).toDate().getTime();
        onChange({ timeCondition: newDate, timeConditionTZ: tz });
      }
    },
    [editedDate, editedTime, editedTz, onChange]
  );

  console.log(timeConditionTZ);

  if (editing && canEdit) {
    return (
      <>
        <DatePicker format={'MMM D yyyy'} defaultValue={timeConditionForTz as any} onChange={handleDateChange} />
        <br />
        <TimePicker
          format={'hh:mm a'}
          use12Hours={true}
          defaultValue={timeConditionTime as any}
          onChange={handleTimeChange}
        />
        <br />
        <Select
          showSearch={true}
          value={timeConditionTZ}
          style={{ minWidth: '120px' }}
          onChange={handleTimeConditionTZChange}
        >
          {moment.tz.names().map((tz, index) => (
            <Select.Option key={index} value={tz}>
              {tz}
            </Select.Option>
          ))}
        </Select>
      </>
    );
  }

  if (hasTimeCondition) {
    return (
      <div>
        {moment(timeConditionForTz).format('MMM D yyyy hh:mm a')}
        <br />
        {timeConditionTZ}
        <br />
        <i style={{ color: 'gray' }}>(local: {moment(timeConditionLocal).format('MMM D yyyy hh:mm a')})</i>
      </div>
    );
  }

  return <span>-</span>;
}

export default TimeCondition;
