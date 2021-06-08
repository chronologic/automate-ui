import React from 'react';
import { DatePicker, DatePickerInput, SelectItem, TimePicker, TimePickerSelect } from 'carbon-components-react';
import moment from 'moment-timezone';

interface IDateTimePickerView {
  light: boolean;
  disabled: boolean;

  onChange: (timestamp: number, tz: string) => void;
  onValidationError: (error: string) => void;
}

type Meridiem = 'AM' | 'PM';

interface IDateTimePickerState {
  combined?: number;
  day?: number;
  dateInvalid: boolean;
  hours?: number;
  minutes?: number;
  month?: number;
  timeInvalid: boolean;
  tz: string;
  year?: number;
  meridiem: Meridiem;
}

class DateTimePicker extends React.Component<IDateTimePickerView, IDateTimePickerState> {
  private timePattern = new RegExp('^(1[0-2]|0?[1-9]):[0-5][0-9]$');

  constructor(props: IDateTimePickerView) {
    super(props);
    this.state = {
      dateInvalid: false,
      meridiem: 'AM',
      timeInvalid: false,
      tz: moment.tz.guess(),
    };
  }

  public render() {
    const onDateChange = this.onDateChange.bind(this);
    const onTimeChange = this.onTimeChange.bind(this);

    return (
      <>
        <div className="datetimepicker">
          <DatePicker id="date-picker" datePickerType="single" dateFormat="d/m/Y" onChange={onDateChange}>
            <DatePickerInput
              id="date-picker-input"
              labelText=""
              iconDescription="description"
              placeholder="dd/mm/yyyy"
              invalid={this.state.dateInvalid}
              invalidText="Date in the past"
              disabled={this.props.disabled}
            />
          </DatePicker>

          <TimePicker
            id="time-picker"
            labelText=""
            maxLength={5}
            placeholder="hh:mm"
            pattern=""
            // tslint:disable-next-line:jsx-no-lambda
            onChange={(e: any) => onTimeChange(e.target.value)}
            invalid={this.state.timeInvalid}
            invalidText="Incorrect time"
            disabled={this.props.disabled}
          >
            {this.renderTimezonePicker()}
          </TimePicker>
        </div>
      </>
    );
  }

  private renderTimezonePicker() {
    const onTimezoneChange = this.onTimezoneChange.bind(this);
    const names = moment.tz.names();
    const userTimezone = moment.tz.guess();
    // prettier-ignore
    const timeZones = names.map((tz, index) => (<SelectItem key={index} value={tz} text={tz} />));

    return (
      <>
        <TimePickerSelect
          labelText=""
          id="time-picker-am-pm"
          disabled={this.props.disabled}
          className="timepicker-light timepicker-am-pm"
          // tslint:disable-next-line:jsx-no-lambda
          onChange={(event: any) => this.onMeridiemChange(event.target.value)}
        >
          <SelectItem value="AM" text="AM" />
          <SelectItem value="PM" text="PM" />
        </TimePickerSelect>
        <TimePickerSelect
          id="time-picker-tz"
          defaultValue={userTimezone}
          // tslint:disable-next-line:jsx-no-lambda
          onChange={(e: any) => onTimezoneChange(e.target.value)}
          disabled={this.props.disabled}
          className="timepicker-light"
          labelText=""
        >
          {timeZones}
        </TimePickerSelect>
      </>
    );
  }

  private tryEmitResult(timeStamp: number, tz: string) {
    if (!isNaN(timeStamp) && !this.state.dateInvalid) {
      this.props.onChange(timeStamp, tz);
    } else {
      this.props.onValidationError('Wrong date');
    }
  }

  private onMeridiemChange(value: Meridiem) {
    const combined = this.combine(
      this.state.year!,
      this.state.month!,
      this.state.day!,
      this.state.hours!,
      this.state.minutes!,
      this.state.tz,
      value
    );

    const isAfter = moment().isAfter(combined);

    this.setState({ combined, dateInvalid: isAfter, meridiem: value }, () => {
      this.tryEmitResult(combined, this.state.tz);
    });
  }

  private onTimezoneChange(tz: string) {
    const combined = this.combine(
      this.state.year!,
      this.state.month!,
      this.state.day!,
      this.state.hours!,
      this.state.minutes!,
      tz,
      this.state.meridiem
    );

    const isAfter = moment().isAfter(combined);

    this.setState({ combined, tz, dateInvalid: isAfter });

    this.tryEmitResult(combined, tz);
  }

  private onDateChange(dates: Date[]) {
    const date = moment(dates[0]);
    const year = date.year();
    const month = date.month();
    const day = date.date();

    const combined = this.combine(
      year,
      month,
      day,
      this.state.hours!,
      this.state.minutes!,
      this.state.tz,
      this.state.meridiem
    );

    const isAfter = moment().isAfter(combined);
    this.setState({ combined, dateInvalid: isAfter, year, month, day });

    this.tryEmitResult(combined, this.state.tz);
  }

  private onTimeChange(time: string) {
    if (time.length < 4) {
      return;
    }

    const isValid = this.timePattern.test(time);
    const parsed = moment(time, 'HH:mm');

    const hours = parsed.hours();
    const minutes = parsed.minutes();

    const combined = this.combine(
      this.state.year!,
      this.state.month!,
      this.state.day!,
      hours,
      minutes,
      this.state.tz,
      this.state.meridiem
    );

    const isAfter = moment().isAfter(combined);
    this.setState({
      combined,
      dateInvalid: isAfter,
      hours,
      minutes,
      timeInvalid: !isValid,
    });

    this.tryEmitResult(combined, this.state.tz);
  }

  private combine(
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number,
    tz: string,
    meridiem: string
  ) {
    if (
      isNaN(day) ||
      isNaN(day) ||
      isNaN(day) ||
      isNaN(hours) ||
      isNaN(minutes) ||
      !meridiem ||
      hours < 1 ||
      hours > 12
    ) {
      return NaN;
    }

    if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }

    const result = moment.tz({ year, month, day, hours, minutes }, tz);

    return result.unix() * 1000;
  }
}

export default DateTimePicker;
