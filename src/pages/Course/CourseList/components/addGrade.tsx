/**
 * @name 新增级别
 */

import { ModalForm, ProForm, ProFormList, ProFormText } from '@ant-design/pro-components';
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
      width={500}
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
        }}
      >
        <h4>新增级别</h4>
        <ProForm.Group>
          <ProFormList
            name="grades"
            creatorButtonProps={{
              position: 'bottom',
              creatorButtonText: '新建一行',
            }}
            copyIconProps={false}
          >
            <ProForm.Group key="gradeNames">
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
              />
            </ProForm.Group>
          </ProFormList>
        </ProForm.Group>
      </div>
    </ModalForm>
  );
};

export default AddGrade;
