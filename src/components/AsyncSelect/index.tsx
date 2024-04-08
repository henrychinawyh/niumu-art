/**
 * @name 动态下拉选项
 */
import { Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';

interface IProps {
  options?: DefaultOptionType[]; // 第一优先
  showSearch?: boolean;
  formatOptions?: (options: any[]) => DefaultOptionType[];
  getOptions?: (options: DefaultOptionType[]) => any;
  request?: (...args: any) => Promise<any>;
  mode: 'multiple' | 'tags' | undefined;
  [keys: string]: any;
}

const AsyncSelect: React.FC<IProps> = (props) => {
  const {
    options: defaultOptions,
    request,
    formatOptions,
    getOptions,
    mode,
    filterOption,
    ...restSelectOptions
  } = props;

  const [options, setOptions] = useState<DefaultOptionType[]>();

  useEffect(() => {
    if (request) {
      handleAsyncRequest(request);
    }
  }, [request]);

  useEffect(() => {
    getOptions?.(defaultOptions || options || []);
  }, [options || defaultOptions]);

  // 处理异步方法
  const handleAsyncRequest = async (fn: (...args: any) => Promise<any>) => {
    const res = await fn();

    if (Array.isArray(res?.data) && formatOptions) {
      const formatedArray = formatOptions(res.data);
      setOptions(formatedArray);
    }

    setOptions(res?.data || []);
  };

  return (
    <Select
      mode={mode}
      options={options || defaultOptions}
      filterOption={filterOption || false}
      {...restSelectOptions}
    />
  );
};

export default AsyncSelect;
