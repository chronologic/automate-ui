import { useEffect, useState } from 'react';
import { Col, Typography, DatePicker, Radio, Form } from 'antd';
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
  const [repeatRange, setRepeatRange] = useState([]);
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

  console.log(repeatRange, repeatFrequency);

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
        <Col flex="auto">
          <Form.Item name="repeatRange">
            <RangePicker size="large" onChange={(range) => setRepeatRange(range as any)} />
          </Form.Item>
        </Col>
        <Col flex="263px">
          <Form.Item name="repeatFrequency" required>
            <Radio.Group
              defaultValue={RepeatFrequency.Daily}
              size="large"
              onChange={(e) => setRepeatFrequency(e.target.value)}
            >
              <Radio.Button value={RepeatFrequency.Daily}>Daily</Radio.Button>
              <Radio.Button value={RepeatFrequency.Weekly}>Weekly</Radio.Button>
              <Radio.Button value={RepeatFrequency.Monthly}>Monthly</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </BaseBlock>
    </Container>
  );
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
`;

export default Repeat;
