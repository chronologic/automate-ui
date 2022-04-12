import { useMemo, useState } from 'react';
import { Checkbox, Typography, Slider } from 'antd';
import styled from 'styled-components';
import { MOBILE_SCREEN_THRESHOLD } from '../../constants';

interface IProps {
  gasPriceAware?: boolean;
  setGasPriceAware: (gasPriceAware: boolean) => void;
  draft?: boolean;
  setDraft: (draft: boolean) => void;
  confirmationTime?: number;
  setConfirmationTime: (draft: number) => void;
  submitted?: boolean;
}

function ConnectionSettings({
  gasPriceAware,
  setGasPriceAware,
  draft,
  setDraft,
  confirmationTime,
  setConfirmationTime,
  submitted,
}: IProps) {
  const sliderMarks: {
    [key: number]: {
      value: string;
      label: React.ReactNode;
    };
  } = useMemo(
    () => ({
      0: {
        value: '0',
        label: <div className={confirmationTime === 0 ? 'selected' : ''}>Immediate</div>,
      },
      1: {
        value: '1d',
        label: (
          <div className={confirmationTime === 1 ? 'selected' : ''}>
            <span>24 hours</span>
            <br />
            <span className="note">(recommended)</span>
          </div>
        ),
      },
      2: {
        value: '3d',
        label: <div className={confirmationTime === 2 ? 'selected' : ''}>3 days</div>,
      },
      3: {
        value: '5d',
        label: <div className={confirmationTime === 3 ? 'selected' : ''}>5 days</div>,
      },
    }),
    [confirmationTime]
  );

  return (
    <>
      <Checkboxes>
        <CheckboxSection>
          <Checkbox checked={gasPriceAware} disabled={submitted} onChange={(e) => setGasPriceAware(e.target.checked)}>
            <Typography.Paragraph className="subtitle">Gas price aware</Typography.Paragraph>
          </Checkbox>
          <p>
            Once the network gas price falls below the gas cost specified in the transaction, it will be broadcast to
            the network.
          </p>
        </CheckboxSection>
        <CheckboxSection>
          <Checkbox checked={draft} disabled={submitted} onChange={(e) => setDraft(e.target.checked)}>
            <Typography.Paragraph className="subtitle">Draft mode (Advanced)</Typography.Paragraph>
          </Checkbox>
          <p>
            No transaction will be broadcast to the Ethereum network until you go to the Transaction list and specify
            additional conditions.
          </p>
        </CheckboxSection>
      </Checkboxes>
      <div>
        <Typography.Paragraph className="subtitle">Estimated Confirmation Time</Typography.Paragraph>
        <p>
          Our algorithms analyze historical gas prices in real time to best propose a gas price for you. Longer wait
          times generally correspond to cheaper gas prices. Since we cannot control the Ethereum network, this is NOT a
          guaranteed confirmation time.
        </p>
        <SliderContainer>
          <Slider
            marks={sliderMarks}
            step={1}
            value={confirmationTime}
            min={0}
            max={3}
            disabled={submitted}
            tooltipVisible={false}
            onChange={setConfirmationTime}
          />
        </SliderContainer>
      </div>
    </>
  );
}

const Checkboxes = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;

  @media (max-width: ${MOBILE_SCREEN_THRESHOLD}px) {
    flex-direction: column;
  }
`;

const CheckboxSection = styled.div`
  flex: 1;

  &:first-child {
    padding-right: 16px;
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  margin-bottom: 100px;

  @media (max-width: ${MOBILE_SCREEN_THRESHOLD}px) {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }

  .ant-slider-mark {
    white-space: nowrap;

    .ant-slider-mark-text {
      color: ${(props) => props.theme.colors.text};
      font-weight: 300;

      .note.note {
        font-weight: 300;
      }
    }

    .ant-slider-mark-text-active .selected {
      font-weight: bold;
    }
  }
`;

export default ConnectionSettings;
