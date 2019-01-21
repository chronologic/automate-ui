import { TextInput } from 'carbon-components-react';
import * as moment from 'moment';
import * as React from 'react';
import { IScheduledTransaction } from 'src/api/SentinelAPI';

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
          className="bx--col-xs-6"
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
