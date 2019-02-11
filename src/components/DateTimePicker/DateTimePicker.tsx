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
  combined?: number;
  day?: number;
  dateInvalid: boolean;
  hours?: number;
  minutes?: number;
  month?: number;
  timeInvalid: boolean;
  tz: string;
  year?: number;
}

class DateTimePicker extends React.Component<
  IDateTimePickerView,
  IDateTimePickerState
> {
  private timePattern = new RegExp(
    '^(([0-1]{0,1}[0-9])|(2[0-3])):[0-5]{0,1}[0-9]$'
  );

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
        <div className="bx--col-xs-3">
          Local time: <br/>
          {this.state.combined ? moment(this.state.combined).format('DD/MM/YYYY HH:mm') : ""}
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
      this.props.onValidationError('Wrong date');
    }
  }

  private onTimezoneChange(tz: string) {
    const combined = this.combine(
      this.state.year!,
      this.state.month!,
      this.state.day!,
      this.state.hours!,
      this.state.minutes!,
      tz
      );
      
    
    this.setState({ combined, tz });
    
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
      this.state.tz
    );

    const isAfter = moment().isAfter(combined);
    this.setState({ combined, dateInvalid: isAfter, year, month, day });

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
      this.state.year!,
      this.state.month!,
      this.state.day!,
      hours,
      minutes,
      this.state.tz
    );

    const isAfter = moment().isAfter(combined);
    this.setState({
      combined,
      dateInvalid: isAfter,
      hours,
      minutes,
      timeInvalid: !isValid
    });

    this.tryEmitResult(combined, this.state.tz);
  }

  private combine(year: number, month: number, day: number, hours: number, minutes: number, tz: string) {
    if (isNaN(day) || isNaN(day) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
      return NaN;
    }

    const result = moment.tz({year, month, day, hours, minutes}, tz)

    return result.unix() * 1000;
  }
}

export default DateTimePicker;
