import { getDateString } from '@/utils/date';
import { ModalForm } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React from 'react';
import { CreateClassParams, TableListItemProps } from '../interface';
import { createClass, editClass } from '../services';

interface IProps {
  title: string;
  onCancel: (refresh?: boolean) => void;
  visible: boolean;
  type?: 'create' | 'edit';
  data?: Partial<TableListItemProps> | null;
}

const CreateOrEdit: React.FC<IProps> = (props) => {
  const { data, title, visible, onCancel, type = 'create' } = props ?? {};
  const [form] = Form.useForm<CreateClassParams>();

  return (
    <ModalForm<CreateClassParams>
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
      initialValues={{
        ...data,
        sex: data?.sex || 1,
        birthDate: data?.birthDate ? getDateString(data?.birthDate) : undefined,
      }}
      onFinish={async (values) => {
        const params: CreateClassParams = {
          ...values,
        };

        let fn = createClass;
        if (type === 'edit') {
          params.id = data?.id;
          fn = editClass;
        }

        try {
          const res = await fn(params);
          if (res) {
            message.success('提交成功');
            onCancel(true);
          }
        } catch (err) {
          console.log(err);
        }

        return true;
      }}
      layout="horizontal"
      grid
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      rowProps={{
        gutter: 10,
      }}
    ></ModalForm>
  );
};

export default CreateOrEdit;
