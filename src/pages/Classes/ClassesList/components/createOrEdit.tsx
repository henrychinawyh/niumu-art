import { getTeacherList } from '@/pages/Teacher/TeacherList/services';
import { getDateString } from '@/utils/date';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
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

  // 根据输入获取任课教师
  const changeTeacher = async (val: string) => {};

  // 根据输入获取学员
  const changeStudent = async (val: string) => {};

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
    >
      <ProFormText
        label="班级名称"
        name="name"
        colProps={{ span: 12 }}
        rules={[
          { required: true, message: '班级名称必填' },
          {
            max: 10,
            message: '班级名称不能超过10个字符',
          },
        ]}
      />

      <ProFormSelect
        label="任课教师"
        name="teacherId"
        colProps={{ span: 12 }}
        rules={[{ required: true, message: '任课教师必选' }]}
        debounceTime={300}
        showSearch
        request={async (params) => {
          const { keywords } = params;

          if (keywords) {
            const res = await getTeacherList({
              name: keywords,
            });

            return [];
          }

          return [];
        }}
      />

      <ProFormSelect
        label="班级学员"
        name="studentIds"
        colProps={{ span: 12 }}
        rules={[{ required: true, message: '任课教师必选' }]}
        debounceTime={300}
      />
    </ModalForm>
  );
};

export default CreateOrEdit;
