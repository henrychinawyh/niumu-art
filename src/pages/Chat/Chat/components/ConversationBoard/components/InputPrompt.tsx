/**
 * @name 输入栏
 */

import { Sender } from '@ant-design/x';
import React, { useState } from 'react';
import { useRequest } from '../../../hooks/useRequest';

interface IProps {
  closePrompt: (...args: any) => void;
}

const InputPrompt: React.FC<IProps> = (props) => {
  const { closePrompt } = props || {};
  const [value, setValue] = useState<string>('');

  const [onRequest] = useRequest();

  const onSubmit = async (message: string) => {
    closePrompt(false);
    onRequest(message);
    setValue('');
  };

  return (
    <div>
      <Sender value={value} onSubmit={onSubmit} onChange={(value) => setValue(value)} />
    </div>
  );
};

export default InputPrompt;
