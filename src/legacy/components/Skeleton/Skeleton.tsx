import React from 'react';
import { TextInputSkeleton } from 'carbon-components-react';

class Skeleton extends React.Component {
  public render() {
    return (
      <div>
        <div className="bx--row row-padding">
          <TextInputSkeleton />
        </div>
        <div className="bx--row row-padding">
          <TextInputSkeleton />
        </div>
        <div className="bx--row row-padding">
          <TextInputSkeleton />
        </div>
      </div>
    );
  }
}

export default Skeleton;
