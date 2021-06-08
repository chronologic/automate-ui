import React from 'react';
import { TextInput } from 'carbon-components-react';
import moment from 'moment';

import { IScheduledTransaction } from '../../../api/SentinelAPI';
import Skeleton from '../Skeleton/Skeleton';

class TimeCondition extends React.Component<IScheduledTransaction, any> {
  public render() {
    if (!this.props || !this.props.id) {
      return <Skeleton />;
    }

    let timeCondition;
    let timeConditionLocal;

    if (this.props.timeCondition) {
      timeConditionLocal = moment(this.props.timeCondition);
      timeCondition = timeConditionLocal.clone().tz(this.props.timeConditionTZ);
    }

    return (
      <div className="bx--row row-padding">
        <TextInput
          id="timeCondition"
          className="bx--col-xs-12"
          labelText="Time condition"
          disabled={true}
          value={`${timeCondition ? timeCondition.toString() : ''} (local: ${
            timeConditionLocal ? timeConditionLocal.toString() : ''
          }) `}
        />
      </div>
    );
  }
}

export default TimeCondition;
