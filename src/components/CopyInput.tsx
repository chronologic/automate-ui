import { useCallback } from 'react';
import { Input, Button, notification } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Search } = Input;

interface IProps {
  value: string;
  className?: string;
  inputTitle?: string;
  onClick?: () => void;
}

export default function CopyInput({ value, inputTitle, className, onClick }: IProps) {
  const handleCopy = useCallback(() => {
    copyToClipboard(value);
    notification.success({ message: 'Copied!' });
  }, [value]);

  return (
    <Content className={className}>
      <Search
        value={value}
        onClick={onClick}
        onSearch={handleCopy}
        readOnly
        title={inputTitle}
        enterButton={
          <Button title="Click to copy">
            <CopyOutlined />
          </Button>
        }
      />
    </Content>
  );
}

const Content = styled.div`
  display: inline-block;

  .ant-input {
    text-overflow: ellipsis;
  }
`;

function copyToClipboard(val: string): void {
  const el = document.createElement('textarea'); // Create a <textarea> element
  el.value = val; // Set its value to the string that you want copied
  el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
  el.style.position = 'absolute';
  el.style.left = '-9999px'; // Move outside the screen to make it invisible
  document.body.appendChild(el); // Append the <textarea> element to the HTML document
  const selected =
    (document.getSelection()?.rangeCount || 0) > 0 // Check if there is any content selected previously
      ? document.getSelection()?.getRangeAt(0) // Store selection if found
      : false; // Mark as false to know no selection existed before
  el.select(); // Select the <textarea> content
  document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el); // Remove the <textarea> element
  if (selected) {
    // If a selection existed before copying
    document.getSelection()?.removeAllRanges(); // Unselect everything on the HTML document
    document.getSelection()?.addRange(selected); // Restore the original selection
  }
}
