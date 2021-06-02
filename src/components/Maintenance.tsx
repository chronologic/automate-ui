import React from 'react';

const style = {
  position: 'fixed',
  width: '100%',
  // tslint:disable-next-line: object-literal-sort-keys
  height: '100vh',
  background: 'white',
  top: '0',
  left: '0',
  zIndex: '999999',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '50px',
} as any;

function Maintenance() {
  return (
    <div style={style}>
      <div style={{ fontSize: '40px' }}>👷‍♀️ 🚧 👷‍♂️</div>
      <div style={{ fontSize: '32px' }}>ChronoLogic Automate is down for maintenance</div>
      <div style={{ fontSize: '24px' }}>We'll be back soon!</div>
    </div>
  );
}

export default Maintenance;
