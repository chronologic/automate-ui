import { TextInputSkeleton } from 'carbon-components-react';
import * as React from 'react';

class Skeleton extends React.Component {
  public render() {
    return (
      <div>
        <div className="bx--row row-padding">
          <TextInputSkeleton/>
        </div>
        <div className="bx--row row-padding">
          <TextInputSkeleton/>
        </div>
        <div className="bx--row row-padding">
          <TextInputSkeleton/>
        </div>
      </div>
    );
  }
}

export default Skeleton;