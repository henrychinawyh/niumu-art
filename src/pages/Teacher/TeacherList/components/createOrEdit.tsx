import { getBirthdayByIdCard } from '@/utils/birthday';
import { getDateString } from '@/utils/date';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React from 'react';
import { TableListItemProps } from '../interface';
import { createTeacher, editTeacher } from '../services';

type FormSubmitProps = Partial<
  Pick<TableListItemProps, 'idCard' | 'phoneNumber' | 'sex' | 'stuName' | 'birthDate' | 'id'>
>;

interface IProps {
  title: string;
  onCancel: (refresh?: boolean) => void;
  visible: boolean;
  type?: 'create' | 'edit';
  data?: Partial<TableListItemProps> | null;
}

const CreateOrEdit: React.FC<IProps> = (props) => {
  const { data, title, visible, onCancel, type = 'create' } = props ?? {};
  const [form] = Form.useForm<FormSubmitProps>();

  return (
    <ModalForm<FormSubmitProps>
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
        const params: FormSubmitProps = {
          ...values,
          idCard: values.idCard?.toUpperCase(),
        };

        let fn = createTeacher;
        if (type === 'edit') {
          params.id = data?.id;
          fn = editTeacher;
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
      onFieldsChange={(changeFields) => {
        const { name, value } = changeFields[0];
        if (name[0] === 'idCard' && value?.length === 18) {
          form.setFieldsValue({
            birthDate: getBirthdayByIdCard(value),
          });
        }
      }}
    >
      <ProFormText
        label="教师姓名"
        name="teaName"
        colProps={{ span: 12 }}
        rules={[
          { required: true, message: '教师姓名必填' },
          {
            max: 10,
            message: '教师姓名不能超过10个字符',
          },
        ]}
      />

      <ProFormText
        label="手机号"
        name="phoneNumber"
        colProps={{ span: 12 }}
        rules={[
          { required: true, message: '手机号必填' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式不正确',
          },
        ]}
      />

      <ProFormRadio.Group
        label="性别"
        name="sex"
        colProps={{ span: 12 }}
        options={[
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ]}
        radioType="button"
      />

      <ProFormText
        label="身份证号"
        name="idCard"
        colProps={{ span: 12 }}
        rules={[
          {
            required: true,
            message: '身份证号必填',
          },
          {
            pattern:
              /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '身份证号格式不正确',
          },
        ]}
      />

      <ProFormDatePicker
        label="生日"
        name="birthDate"
        colProps={{ span: 12 }}
        rules={[{ required: true, message: '生日必选' }]}
        dataFormat="YYYY-MM-DD"
        disabled
      />
    </ModalForm>
  );
};

export default CreateOrEdit;
