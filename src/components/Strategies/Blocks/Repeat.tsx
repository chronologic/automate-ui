import { useCallback, useEffect, useState } from 'react';
import { Col, Row, Typography, DatePicker, Radio, Form, TimePicker, InputNumber } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import moment, { Moment } from 'moment-timezone';

import { IStrategyRepetition, IThemeProps } from '../../../types';
import { RepeatFrequency } from '../../../constants';
import { useStrategyStore } from '../../../hooks';
import BaseBlock from './BaseBlock';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const defaultFrequencyHours = 6;

function Repeat() {
  const setRepetitions = useStrategyStore((state) => state.setRepetitions);
  const [repeatRange, setRepeatRange] = useState<[Moment, Moment]>([] as any);
  const [startTime, setStartTime] = useState<Moment>();
  const [repeatFrequency, setRepeatFrequency] = useState(RepeatFrequency.Daily);
  const [frequencyHours, setFrequencyHours] = useState(defaultFrequencyHours);

  const handleSetRepeatFrequency = useCallback((freq) => {
    if (freq !== RepeatFrequency.Hourly) {
      setFrequencyHours(defaultFrequencyHours);
    }
    setRepeatFrequency(freq);
  }, []);

  useEffect(() => {
    try {
      if (!startTime) {
        return;
      }
      const [from, to] = repeatRange;

      const fromDateTime = copyTime(from, startTime);
      const toDateTime = copyTime(to, startTime);

      const repetitions = calculateRepetitions(fromDateTime, toDateTime, repeatFrequency, frequencyHours);
      setRepetitions(repetitions);
    } catch (e) {
      console.error(e);
    }
  }, [repeatRange, repeatFrequency, setRepetitions, startTime, frequencyHours]);

  return (
    <Container>
      <BaseBlock
        title={
          <>
            <ReloadOutlined />
            <Text className="cardTitle">Repeat</Text>
          </>
        }
      >
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item name="repeatRange" rules={[{ required: true, message: 'Date range is required' }]}>
              <RangePicker
                size="large"
                disabledDate={disablePastDates}
                onChange={(range) => setRepeatRange(range as any)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="repeatStartTime" rules={[{ required: true, message: 'Start time is required' }]}>
              <TimePicker
                size="large"
                placeholder="Start time"
                use12Hours
                format="h:mm a"
                placement="topLeft"
                onChange={(time) => setStartTime(time as any)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item
              name="repeatFrequency"
              initialValue={RepeatFrequency.Daily}
              rules={[{ required: true, message: 'Frequency is required' }]}
            >
              <Radio.Group size="large" onChange={(e) => handleSetRepeatFrequency(e.target.value)}>
                <Radio.Button value={RepeatFrequency.Hourly}>Hourly</Radio.Button>
                <Radio.Button value={RepeatFrequency.Daily}>Daily</Radio.Button>
                <Radio.Button value={RepeatFrequency.Weekly}>Weekly</Radio.Button>
                <Radio.Button value={RepeatFrequency.Monthly}>Monthly</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>

          {repeatFrequency === RepeatFrequency.Hourly && (
            <Col span={8} className="frequencyHours">
              <Text>Repeat every </Text>
              <Form.Item
                name="frequencyHours"
                initialValue={defaultFrequencyHours}
                rules={[{ required: true, message: 'Hourly frequency is required' }]}
              >
                <InputNumber
                  className="frequencyHoursInput"
                  size="large"
                  value={frequencyHours}
                  min={1}
                  max={23}
                  step={1}
                  onChange={(value) => setFrequencyHours(value)}
                />{' '}
              </Form.Item>
              <Text>hour{frequencyHours > 1 && 's'}</Text>
            </Col>
          )}
        </Row>
      </BaseBlock>
    </Container>
  );
}

function disablePastDates(date: Moment): boolean {
  const today = moment().startOf('day');
  return date.isBefore(today);
}

function copyTime(date: Moment, time: Moment): Moment {
  const ret = date.clone();
  ['hour', 'minute', 'second', 'millisecond'].forEach((unit) => {
    ret.set(unit as any, time.get(unit as any));
  });

  return ret;
}

function calculateRepetitions(
  from: Moment,
  to: Moment,
  repeatFrequency: RepeatFrequency,
  frequencyHours: number
): IStrategyRepetition[] {
  const repetitions: IStrategyRepetition[] = [];
  const tz = moment.tz.guess();
  const step = repeatFrequency === RepeatFrequency.Hourly ? frequencyHours : 1;

  let currentDateTime = from;
  while (currentDateTime.isSameOrBefore(to)) {
    repetitions.push({
      time: currentDateTime.toDate().getTime(),
      tz,
    });
    currentDateTime = currentDateTime.add(step, repeatFrequency);
  }

  return repetitions;
}

const Container = styled.div`
  .ant-card {
    border: none;
    background-color: ${(props: IThemeProps) => props.theme.colors.accent} !important;
    margin-bottom: 0px !important;
  }
  .ant-card-head {
    border-color: rgb(255 255 255 / 25%);
  }
  .ant-card-extra {
    color: rgb(255 255 255 / 45%) !important;
  }

  .ant-form-item-explain-error {
    color: ${(props: IThemeProps) => props.theme.colors.text};
  }

  .ant-picker-range {
    width: 100%;
  }

  .ant-picker-large {
    width: 100%;
  }

  .frequencyHoursInput {
    width: 60px;
    margin: 0 10px;
  }

  .frequencyHours {
    display: flex;
  }
`;

export default Repeat;
