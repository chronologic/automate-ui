import React from 'react';
import moment from 'moment';
import { Button, Checkbox, InlineLoading, Modal, TextInput } from 'carbon-components-react';
import { CopyOutlined } from '@ant-design/icons';
import Countdown from 'react-countdown';

import { IScheduleAccessKey, IScheduledTransaction, SentinelAPI } from '../../../api/SentinelAPI';
import { ISubmitParams, Status } from '../../../types';
import ScheduledLink from './ScheduledLink';

const AnyButton: any = Button;

interface IInputElement extends HTMLElement {
  value: any;
  select(): any;
  setSelectionRange(start: number, end: number): any;
}

interface IPaymentModalProps {
  open: boolean;
  loading: boolean;
  sentinelResponse: IScheduleAccessKey;
  onDismiss: () => void;
  onSubmit: (params: ISubmitParams) => void;
  onReset: () => void;
}

interface IEmailAndRefundAddress {
  email: string;
  refundAddress: string;
}

function retrieveEmailAndRefundAddress(): IEmailAndRefundAddress {
  return JSON.parse(localStorage.getItem('payment_credentials') || '{"email": "", "refundAddress": ""}');
}

function storeEmailAndRefundAddress(params: IEmailAndRefundAddress): void {
  localStorage.setItem('payment_credentials', JSON.stringify(params));
}

const PaymentModal: React.FunctionComponent<IPaymentModalProps> = ({
  open,
  loading,
  sentinelResponse,
  onDismiss,
  onSubmit,
  onReset,
}) => {
  const [email, setEmail] = React.useState<string>(retrieveEmailAndRefundAddress().email);
  const [refundAddress, setRefundAddress] = React.useState<string>(retrieveEmailAndRefundAddress().refundAddress);
  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);
  const [scheduled, setScheduled] = React.useState<IScheduledTransaction>();
  const expirationDate = React.useMemo(() => {
    if (sentinelResponse && sentinelResponse.createdAt) {
      return moment(sentinelResponse.createdAt).add(1, 'hour').toDate().getTime();
    }
    return moment().add(1, 'hour').toDate().getTime();
  }, [sentinelResponse]);
  const handleEmailChange = React.useCallback((e) => setEmail(e.target.value), [setEmail]);
  const handleRefundAddressChange = React.useCallback((e) => setRefundAddress(e.target.value), [setRefundAddress]);
  const handleSubmit = React.useCallback(() => {
    storeEmailAndRefundAddress({
      email,
      refundAddress,
    });
    onSubmit({
      email,
      refundAddress,
    });
  }, [email, refundAddress, onSubmit]);
  const handleCopyAmount = React.useCallback(() => {
    copyToClipboard('10');
  }, []);
  const handleCopyAddress = React.useCallback(() => {
    copyToClipboard(sentinelResponse?.paymentAddress);
  }, [sentinelResponse]);
  const handleScheduleAnother = React.useCallback(() => {
    // don't reset email and refund address - remember them
    // setEmail('');
    // setRefundAddress('');
    setTermsAccepted(false);
    setScheduled(undefined);
    onReset();
  }, [onReset]);

  React.useEffect(() => {
    let refreshInterval: any;
    if (
      sentinelResponse &&
      (!scheduled ||
        (scheduled && [Status.PendingPayment, Status.PendingPaymentConfirmations].includes(scheduled.status)))
    ) {
      const refresh = async () => {
        const res = (await SentinelAPI.get(sentinelResponse)) as IScheduledTransaction;
        if (JSON.stringify(scheduled || {}) !== JSON.stringify(res)) {
          setScheduled(res);
        }
      };
      refreshInterval = setInterval(refresh, 10 * 1000);
      refresh();
    }

    return () => {
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
      }
    };
  }, [sentinelResponse, scheduled, setScheduled]);

  const formValid = !!email && !!refundAddress && !!termsAccepted;
  const amountNode = (
    <span>
      10.0{' '}
      {/* <a
        href="https://coinmarketcap.com/currencies/chronologic/"
        target="_blank"
        rel="noopener noreferer"
      > */}
      DAY
      {/* </a> */}
      {scheduled?.status === Status.PendingPayment && (
        <div className="payment-modal__copy-container" onClick={handleCopyAmount}>
          <CopyOutlined />
        </div>
      )}
    </span>
  );
  const orderIdNode = (
    <div className="payment-modal__order-id">
      <b>Order ID</b>: {sentinelResponse?.id}
    </div>
  );
  const detailsNode = (
    <div>
      Details of the scheduled transaction can be found here:
      <br />
      <ScheduledLink id={sentinelResponse?.id} signature={sentinelResponse?.key} />
      <br />
      Please bookmark this link
    </div>
  );
  const ticketNode = (
    <div>
      <i>Noticed anything not quite right?</i>
      <br />
      <a href="https://chronologic.zendesk.com/hc/en-us/requests/new" target="_blank" rel="noreferrer">
        Submit a ticket
      </a>
    </div>
  );

  let content;
  if (scheduled?.status === Status.PendingPayment) {
    content = (
      <div>
        {orderIdNode}
        <br />
        <div>Send {amountNode} to the following address:</div>
        <br />
        <div>
          <span className="payment-modal__address">{sentinelResponse?.paymentAddress}</span>{' '}
          <div className="payment-modal__copy-container" onClick={handleCopyAddress}>
            <CopyOutlined />
          </div>
        </div>
        <input type="text" id="clipboard" style={{ opacity: 0 }} />
        <div>
          The payment address will expire in{' '}
          <span className="payment-modal__countdown">
            <Countdown date={expirationDate} daysInHours={true} />
          </span>
        </div>
        {/* <br />
        <br />
        {detailsNode} */}
      </div>
    );
  } else if (scheduled?.status === Status.PaymentExpired) {
    content = (
      <div className="payment-modal__thank-you-screen">
        <h1>Payment expired</h1>
        <br />
        <h3>
          We did not receive your DAY payment within the alloted time
          <br />
          Please schedule another transaction
        </h3>
        <br />
        <br />
        {detailsNode}
        <br />
        <br />
        {ticketNode}
      </div>
    );
  } else if (scheduled?.status === Status.PendingPaymentConfirmations) {
    content = (
      <div className="payment-modal__thank-you-screen">
        <h1>Thank You</h1>
        <br />
        <h3>
          Your DAY payment is being confirmed
          <br />
          and your Automation is about to go live
        </h3>
        <br />
        <ul>
          <li>
            Your DAY has been spotted:{' '}
            <a href={'https://etherscan.io/tx/' + scheduled?.paymentTx} target="_blank" rel="noopener noreferrer">
              click here to see the transaction
            </a>
          </li>
          <li>
            Your Automation will go live after the DAY payment transaction
            <br />
            reaches 30 confirmations on the blockchain
          </li>
        </ul>
        <br />
        <br />
        {detailsNode}
        <br />
        <br />
        {ticketNode}
      </div>
    );
  } else if (scheduled?.status != null) {
    content = (
      <div className="payment-modal__thank-you-screen">
        <h1>Thank You</h1>
        <br />
        <h3>
          Your DAY payment has been confirmed
          <br />
          and your Automation is live
        </h3>
        <br />
        <br />
        {detailsNode}
        <br />
        <br />
        {ticketNode}
        <br />
        <div className="payment-modal__button-container">
          <Button onClick={handleScheduleAnother}>Schedule another</Button>
        </div>
      </div>
    );
  } else {
    content = (
      <div>
        <div>
          In order to Automate your transaction a payment of {amountNode} must be made.
          <br />
          Your transaction will be scheduled once the payment has been received.
        </div>
        <br />
        <div>
          <TextInput
            id="email"
            labelText="Email"
            type="text"
            placeholder="Your email address"
            value={email}
            onChange={handleEmailChange}
          />
          <br />
          <TextInput
            id="refundAddress"
            labelText="Refund address"
            type="text"
            placeholder="DAY refund address"
            value={refundAddress}
            onChange={handleRefundAddressChange}
          />
          <br />
          <i>Your email and refund address are required in case anything goes wrong with your payment</i>
          <br />
          <br />
          <div style={{ marginLeft: '4px' }}>
            <Checkbox
              id="acceptTerms"
              labelText={
                <span>
                  I agree to the{' '}
                  <a
                    href="https://chronologic.zendesk.com/hc/en-us/articles/360011331820"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms
                  </a>
                </span>
              }
              checked={termsAccepted}
              onChange={setTermsAccepted}
            />
          </div>
        </div>
        <br />
        <div className="payment-modal__button-container">
          <AnyButton disabled={!formValid || loading || sentinelResponse} onClick={handleSubmit}>
            {loading ? <InlineLoading className="white-loading" description="Loading..." /> : 'Next'}
          </AnyButton>
        </div>
      </div>
    );
  }

  return (
    <Modal open={open} passiveModal={true} modalHeading="Payment" onRequestClose={onDismiss}>
      <div className="payment-modal__container">{content}</div>
    </Modal>
  );
};

function copyToClipboard(value: string) {
  const clipboardInput = document.getElementById('clipboard') as IInputElement;
  clipboardInput.value = value;
  clipboardInput.select();
  clipboardInput.setSelectionRange(0, 99999); /*For mobile devices*/

  document.execCommand('copy');
}

export default PaymentModal;
