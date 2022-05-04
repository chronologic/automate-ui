import { useEffect, useState } from 'react';
import { Col, Row, Typography, DatePicker, Radio, Form, TimePicker } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import moment, { Moment } from 'moment-timezone';

import { IStrategyRepetition, IThemeProps } from '../../../types';
import { RepeatFrequency } from '../../../constants';
import { useStrategyStore } from '../../../hooks';
import BaseBlock from './BaseBlock';

const { Text } = Typography;
const { RangePicker } = DatePicker;

function Repeat() {
  const setRepetitions = useStrategyStore((state) => state.setRepetitions);
  const [repeatRange, setRepeatRange] = useState<[Moment, Moment]>([] as any);
  const [startTime, setStartTime] = useState<Moment>();
  const [repeatFrequency, setRepeatFrequency] = useState(RepeatFrequency.Daily);

  useEffect(() => {
    try {
      const [from, to] = repeatRange;
      const repetitions = calculateRepetitions(from, to, repeatFrequency);
      setRepetitions(repetitions);
    } catch (e) {
      console.error(e);
    }
  }, [repeatRange, repeatFrequency, setRepetitions]);

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
        <Row>
          <Col flex={1}>
            <Form.Item name="repeatRange" rules={[{ required: true, message: 'Date range is required' }]}>
              <RangePicker
                size="large"
                disabledDate={disablePastDates}
                onChange={(range) => setRepeatRange(range as any)}
              />
            </Form.Item>
          </Col>
          <Col flex={1}>
            <Form.Item name="repeatStartTime" rules={[{ required: true, message: 'Start time is required' }]}>
              <TimePicker size="large" placeholder="Start time" onChange={(time) => setStartTime(time as any)} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item name="repeatFrequency" rules={[{ required: true, message: 'Frequency is required' }]}>
              <Radio.Group
                defaultValue={RepeatFrequency.Daily}
                size="large"
                onChange={(e) => setRepeatFrequency(e.target.value)}
              >
                <Radio.Button value={RepeatFrequency.Hourly}>Hourly</Radio.Button>
                <Radio.Button value={RepeatFrequency.Daily}>Daily</Radio.Button>
                <Radio.Button value={RepeatFrequency.Weekly}>Weekly</Radio.Button>
                <Radio.Button value={RepeatFrequency.Monthly}>Monthly</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </BaseBlock>
    </Container>
  );
}

function disablePastDates(date: Moment): boolean {
  const today = moment().startOf('day');
  return date.isBefore(today);
}

function calculateRepetitions(from: Moment, to: Moment, repeatFrequency: RepeatFrequency): IStrategyRepetition[] {
  const repetitions: IStrategyRepetition[] = [];
  const tz = moment.tz.guess();

  let currentDate = from;
  while (currentDate.isSameOrBefore(to)) {
    repetitions.push({
      time: currentDate.toDate().getTime(),
      tz,
    });
    currentDate = currentDate.add(1, repeatFrequency);
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
`;

export default Repeat;
