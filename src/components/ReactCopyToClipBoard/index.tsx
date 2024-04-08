/**
 * @name React 文本复制组件
 */

import { message } from 'antd';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ReactCopyToClipBoardProps {
  value?: string;
  children?: React.ReactNode;
  onCopy?: (text: string, result: boolean) => void;
  [key: string]: any;
}

const ReactCopyToClipBoard = (props: ReactCopyToClipBoardProps) => {
  const {
    value = '',
    children = null,
    onCopy = (text: string, result: boolean) => {
      console.log(text, result);
      message.success('已复制到剪切板');
    },
    ...restProps
  } = props || {};

  return (
    <CopyToClipboard
      onCopy={onCopy}
      text={typeof children === 'string' ? children : value}
      {...restProps}
    >
      <div style={{ cursor: 'pointer' }}>{children}</div>
    </CopyToClipboard>
  );
};

export default ReactCopyToClipBoard;
