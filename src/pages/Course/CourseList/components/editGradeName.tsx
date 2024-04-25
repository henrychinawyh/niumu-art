/**
 * @name 编辑课程名称
 */

import { Form, Input, Modal, message } from 'antd';
import React from 'react';
import { editCourseGrade } from '../services';

export type CourseGradeProps = {
  id: number;
  courseId: number;
  name: string;
};

interface EditGradeNameProps {
  visible: boolean;
  onCancel: (status?: boolean) => void;
  info: CourseGradeProps | null;
  [keys: string]: any;
}

const EditGradeName: React.FC<EditGradeNameProps> = (props) => {
  const { visible, info, onCancel } = props || {};

  const [form] = Form.useForm();

  return (
    <Modal
      title="修改级别名称"
      destroyOnClose
      maskClosable={false}
      visible={visible}
      onOk={async () => {
        const values = await form.validateFields();

        const res = await editCourseGrade({
          ...info,
          ...values,
        });

        if (res.code === '000') {
          message.success('操作成功');
          onCancel?.(true);
        }
      }}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <Form
        form={form}
        initialValues={{
          name: info?.name,
        }}
      >
        <Form.Item
          label="级别名称"
          name="name"
          rules={[{ required: true, message: '请输入级别名称' }]}
        >
          <Input placeholder="请输入级别名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditGradeName;
