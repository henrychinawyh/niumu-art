/**
 * @name 查询搜索学员弹框
 */

import { getStudent } from '@/pages/Student/StudentList/services';
import { convertArrayToOptions } from '@/utils';
import { Col, Modal, Row } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import AsyncSelect from '../AsyncSelect';

interface IProps {
  title?: string;
  debounceTime?: number;
  mode: 'multiple' | 'tags' | undefined;
  onOk: (...args: any) => void;
  [keys: string]: any;
}

const QueryStudentModal: React.FC<IProps> = (props) => {
  const { title = '搜索学员', onOk, debounceTime, mode, ...modalProps } = props;
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [value, setValue] = useState<DefaultOptionType[]>([]);

  // 搜索学员
  const onSearch = async (value: any) => {
    if (value) {
      const res = await getStudent({ stuName: value });
      if (res?.code === '000') {
        setOptions(convertArrayToOptions(res?.data, 'id', 'stuName'));
      }
    }
  };

  const debounceSearch = debounce(onSearch, debounceTime);

  console.log(modalProps.width, 'modalProps.width');

  return (
    <Modal
      styles={{
        body: {
          padding: 12,
        },
      }}
      title={title}
      {...modalProps}
      onOk={() => {
        onOk(value);
      }}
      width={modalProps.width || 500}
    >
      <Row>
        <Col span={16}>
          <AsyncSelect
            placeholder="请输入学员姓名"
            style={{ width: '100%' }}
            options={options}
            showSearch
            onSearch={debounceTime ? debounceSearch : onSearch}
            onChange={(val: any) => setValue(val || [])}
            mode={mode}
            value={value}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default QueryStudentModal;
