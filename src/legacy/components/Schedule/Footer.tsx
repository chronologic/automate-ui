import * as React from 'react';

const Footer: React.FunctionComponent<{}> = () => {
  return (
    <div className="main-section footer">
      <ul>
        <li>
          <a
            href="https://blog.chronologic.network/tagged/automate"
            target="_blank"
            rel="noopener noreferrer"
            className="bx--tooltip--definition"
          >
            <button
              className="bx--tooltip__trigger"
              type="button"
              aria-describedby="definition-tooltip"
            >
              What is Automate?
            </button>
            <div
              id="definition-tooltip"
              role="tooltip"
              className="bx--tooltip--definition__bottom"
            >
              <span className="bx--tooltip__caret" />
              <p>Conditional scheduling for Ethereum network</p>
            </div>
          </a>
        </li>
        <li>
          <a
            href="https://app.chronologic.network"
            target="_blank"
            rel="noopener noreferrer"
            className="bx--tooltip--definition"
          >
            <button
              className="bx--tooltip__trigger"
              type="button"
              aria-describedby="definition-tooltip"
            >
              Chronos &amp; Other dApps
            </button>
            <div
              id="definition-tooltip"
              role="tooltip"
              className="bx--tooltip--definition__bottom"
            >
              <span className="bx--tooltip__caret" />
              <p>Chronos, Run a Timenode &amp; our other scheduling dApps</p>
            </div>
          </a>
        </li>
        <li>
          <a
            href="https://chronologic.zendesk.com/hc/en-us"
            target="_blank"
            rel="noopener noreferrer"
            className="bx--tooltip--definition"
          >
            <button
              className="bx--tooltip__trigger"
              type="button"
              aria-describedby="definition-tooltip"
            >
              Support
            </button>
            <div
              id="definition-tooltip"
              role="tooltip"
              className="bx--tooltip--definition__bottom"
            >
              <span className="bx--tooltip__caret" />
              <p>Contact ChronoLogic team by submitting a request</p>
            </div>
          </a>
        </li>
        <li>
          <a
            href="https://blog.chronologic.network"
            target="_blank"
            rel="noopener noreferrer"
            className="bx--tooltip--definition"
          >
            <button
              className="bx--tooltip__trigger"
              type="button"
              aria-describedby="definition-tooltip"
            >
              Blog
            </button>
            <div
              id="definition-tooltip"
              role="tooltip"
              className="bx--tooltip--definition__bottom"
            >
              <span className="bx--tooltip__caret" />
              <p>Stay updated by subscribing to our Medium</p>
            </div>
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/ChronoLogicETH"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
          >
            <svg viewBox="0 0 512 512" width="32px">
              <path d="M419.6 168.6c-11.7 5.2-24.2 8.7-37.4 10.2 13.4-8.1 23.8-20.8 28.6-36 -12.6 7.5-26.5 12.9-41.3 15.8 -11.9-12.6-28.8-20.6-47.5-20.6 -42 0-72.9 39.2-63.4 79.9 -54.1-2.7-102.1-28.6-134.2-68 -17 29.2-8.8 67.5 20.1 86.9 -10.7-0.3-20.7-3.3-29.5-8.1 -0.7 30.2 20.9 58.4 52.2 64.6 -9.2 2.5-19.2 3.1-29.4 1.1 8.3 25.9 32.3 44.7 60.8 45.2 -27.4 21.4-61.8 31-96.4 27 28.8 18.5 63 29.2 99.8 29.2 120.8 0 189.1-102.1 185-193.6C399.9 193.1 410.9 181.7 419.6 168.6z" />
            </svg>
          </a>
        </li>
        <li>
          <a
            href="https://t.me/chronologicnetwork"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-link"
          >
            <svg viewBox="0 0 32 32" width="27px">
              <path d="M 26.070313 3.996094 C 25.734375 4.011719 25.417969 4.109375 25.136719 4.21875 L 25.132813 4.21875 C 24.847656 4.332031 23.492188 4.902344 21.433594 5.765625 C 19.375 6.632813 16.703125 7.757813 14.050781 8.875 C 8.753906 11.105469 3.546875 13.300781 3.546875 13.300781 L 3.609375 13.277344 C 3.609375 13.277344 3.25 13.394531 2.875 13.652344 C 2.683594 13.777344 2.472656 13.949219 2.289063 14.21875 C 2.105469 14.488281 1.957031 14.902344 2.011719 15.328125 C 2.101563 16.050781 2.570313 16.484375 2.90625 16.722656 C 3.246094 16.964844 3.570313 17.078125 3.570313 17.078125 L 3.578125 17.078125 L 8.460938 18.722656 C 8.679688 19.425781 9.949219 23.597656 10.253906 24.558594 C 10.433594 25.132813 10.609375 25.492188 10.828125 25.765625 C 10.933594 25.90625 11.058594 26.023438 11.207031 26.117188 C 11.265625 26.152344 11.328125 26.179688 11.390625 26.203125 C 11.410156 26.214844 11.429688 26.21875 11.453125 26.222656 L 11.402344 26.210938 C 11.417969 26.214844 11.429688 26.226563 11.441406 26.230469 C 11.480469 26.242188 11.507813 26.246094 11.558594 26.253906 C 12.332031 26.488281 12.953125 26.007813 12.953125 26.007813 L 12.988281 25.980469 L 15.871094 23.355469 L 20.703125 27.0625 L 20.8125 27.109375 C 21.820313 27.550781 22.839844 27.304688 23.378906 26.871094 C 23.921875 26.433594 24.132813 25.875 24.132813 25.875 L 24.167969 25.785156 L 27.902344 6.65625 C 28.007813 6.183594 28.035156 5.742188 27.917969 5.3125 C 27.800781 4.882813 27.5 4.480469 27.136719 4.265625 C 26.769531 4.046875 26.40625 3.980469 26.070313 3.996094 Z M 25.96875 6.046875 C 25.964844 6.109375 25.976563 6.101563 25.949219 6.222656 L 25.949219 6.234375 L 22.25 25.164063 C 22.234375 25.191406 22.207031 25.25 22.132813 25.308594 C 22.054688 25.371094 21.992188 25.410156 21.667969 25.28125 L 15.757813 20.75 L 12.1875 24.003906 L 12.9375 19.214844 C 12.9375 19.214844 22.195313 10.585938 22.59375 10.214844 C 22.992188 9.84375 22.859375 9.765625 22.859375 9.765625 C 22.886719 9.3125 22.257813 9.632813 22.257813 9.632813 L 10.082031 17.175781 L 10.078125 17.15625 L 4.242188 15.191406 L 4.242188 15.1875 C 4.238281 15.1875 4.230469 15.183594 4.226563 15.183594 C 4.230469 15.183594 4.257813 15.171875 4.257813 15.171875 L 4.289063 15.15625 L 4.320313 15.144531 C 4.320313 15.144531 9.53125 12.949219 14.828125 10.71875 C 17.480469 9.601563 20.152344 8.476563 22.207031 7.609375 C 24.261719 6.746094 25.78125 6.113281 25.867188 6.078125 C 25.949219 6.046875 25.910156 6.046875 25.96875 6.046875 Z " />
            </svg>
          </a>
        </li>
      </ul>
      <br />
      ChronoLogic {new Date().getFullYear()}
    </div>
  );
};

export default Footer;
