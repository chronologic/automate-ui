import {
  DatePicker,
  DatePickerInput,
  SelectItem,
  TimePicker,
  TimePickerSelect
} from 'carbon-components-react';
import * as moment from 'moment-timezone';
import * as React from 'react';

interface IDateTimePickerView {
  disabled: boolean;

  onChange: (timestamp: number, tz: string) => void;
  onValidationError: (error: string) => void;
}

interface IDateTimePickerState {
  date?: number;
  timeInvalid: boolean;
  dateInvalid: boolean;
  minutes?: number;
  hours?: number;
  tz: string;
}

class DateTimePicker extends React.Component<
  IDateTimePickerView,
  IDateTimePickerState
> {
  private timePattern = new RegExp('^(([0-1]{0,1}[0-9])|(2[0-3])):[0-5]{0,1}[0-9]$');

  constructor(props: any) {
    super(props);
    this.state = {
      dateInvalid: false,
      timeInvalid: false,
      tz: moment.tz.guess()
    };
  }

  public render() {
    const onDateChange = this.onDateChange.bind(this);
    const onTimeChange = this.onTimeChange.bind(this);

    return (
      <div className="bx--row row-padding">
      <div className="bx--col-xs-2">
        <DatePicker
          id="date-picker"
          datePickerType="single"
          dateFormat="d/m/Y"
          onChange={onDateChange}
        >
          <DatePickerInput
            id="date-picker-input"
            labelText="Date"
            iconDescription="description"
            placeholder="dd/mm/yyyy"
            invalid={this.state.dateInvalid}
            invalidText="Date in the past"
            disabled={this.props.disabled}
          />
        </DatePicker>
        </div>
        <div className="bx--col-xs-3">
        <TimePicker
          id="time-picker"
          labelText="Time"
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
      </div>
    );
  }

  private renderTimezonePicker() {
    const onTimezoneChange = this.onTimezoneChange.bind(this);
    const names = moment.tz.names();
    const userTimezone = moment.tz.guess();
    // prettier-ignore
    const timeZones = names.map(tz => (<SelectItem value={tz} text={tz} />));

    return (
      <TimePickerSelect
        id="time-picker-tz"
        defaultValue={userTimezone}
        // tslint:disable-next-line:jsx-no-lambda
        onChange={(e: any) => onTimezoneChange(e.target.value)}
        disabled={this.props.disabled}
      >
        {timeZones}
      </TimePickerSelect>
    );
  }

  private tryEmitResult(timeStamp: number, tz: string) {
    if (!isNaN(timeStamp)) {
      this.props.onChange(timeStamp, tz);
    } else {
      this.props.onValidationError("Wrong date");
    }
  }

  private onTimezoneChange(tz: string) {
    this.setState({ tz });

    const combined = this.combine(
      this.state.date!,
      this.state.hours!,
      this.state.minutes!,
      tz
    );

    this.tryEmitResult(combined, tz);
  }

  private onDateChange(dates: Date[]) {
    const ts = dates[0].getTime();
        
    const combined = this.combine(
      ts,
      this.state.hours!,
      this.state.minutes!,
      this.state.tz
      );
      
    const isAfter = moment().isAfter(combined);
    this.setState({ dateInvalid: isAfter, date: ts });

    this.tryEmitResult(combined, this.state.tz);
  }

  private onTimeChange(time: string) {
    if (time.length < 5) {
      return;
    }

    const isValid = this.timePattern.test(time);
    const parsed = moment(time, 'HH:mm');

    const hours = parsed.hours();
    const minutes = parsed.minutes();
  
    const combined = this.combine(
      this.state.date!,
      hours,
      minutes,
      this.state.tz
    );

    const isAfter = moment().isAfter(combined);
    this.setState({ dateInvalid: isAfter, timeInvalid: !isValid, hours, minutes });

    this.tryEmitResult(combined, this.state.tz);
  }

  private combine(date: number, hours: number, minutes: number, tz: string) {
    if (!date || isNaN(hours) || isNaN(minutes)) {
      return NaN;
    }

    const result = moment
      .tz(date, tz)
      .hours(hours)
      .minutes(minutes);

    return result.unix() * 1000;
  }
}

export default DateTimePicker;
