/**
 * @name 新增级别
 */

import { convertObjectToArray } from '@/utils';
import { TERM } from '@/utils/constant';
import {
  ModalForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

type FormSubmitProps = any;

interface IProps {
  title: string;
  onCancel: () => void;
  visible: boolean;
  onFinish: (values: any) => Promise<any>;
  [keys: string]: any;
}

const AddGrade: React.FC<IProps> = (props) => {
  const { title, visible, onCancel, onFinish } = props ?? {};

  const [form] = Form.useForm<FormSubmitProps>();

  return (
    <ModalForm<FormSubmitProps>
      width={800}
      title={title}
      modalProps={{
        onCancel: () => {
          onCancel();
        },
        destroyOnClose: true,
        maskClosable: false,
      }}
      visible={visible}
      autoFocusFirstInput
      form={form}
      onFinish={onFinish}
      grid
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <h4>新增级别</h4>
        <ProFormList
          name="grades"
          creatorButtonProps={{
            position: 'bottom',
            creatorButtonText: '新建一行',
          }}
          copyIconProps={false}
        >
          <ProFormGroup key="gradeNames">
            <ProFormSelect
              options={convertObjectToArray(TERM)}
              name="courseSemester"
              initialValue="1"
              colProps={{ span: 4 }}
            />
            <ProFormText
              placeholder={'请输入级别名称'}
              name="name"
              labelCol={{ span: 0 }}
              rules={[
                {
                  required: true,
                  message: '请输入级别名称',
                },
              ]}
              colProps={{ span: 8 }}
            />

            <ProFormText
              name="courseOriginPrice"
              placeholder="请输入课程价格"
              rules={[
                {
                  required: true,
                  message: '请输入课程价格',
                },
              ]}
              labelCol={{ span: 0 }}
              colProps={{ span: 6 }}
            />

            <ProFormText
              name="courseCount"
              placeholder="请输入课程时数"
              rules={[
                {
                  required: true,
                  message: '请输入课程时数',
                },
              ]}
              labelCol={{ span: 0 }}
              colProps={{ span: 6 }}
            />
          </ProFormGroup>
        </ProFormList>
      </div>
    </ModalForm>
  );
};

export default AddGrade;
