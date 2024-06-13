/**
 * @name 编辑课程名称
 */

import { convertObjectToArray } from '@/utils';
import { TERM } from '@/utils/constant';
import { Form, Input, Modal, Select, message } from 'antd';
import React from 'react';
import { editCourseGrade } from '../services';

export type CourseGradeProps = {
  id: number;
  courseId: number;
  name: string;
  courseSemester: number;
  courseCount: number;
  courseOriginPrice: number;
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
          id: info?.id,
          courseId: info?.courseId,
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
          courseSemester: info?.courseSemester ? `${info?.courseSemester}` : '1',
          courseCount: info?.courseCount,
          courseOriginPrice: info?.courseOriginPrice,
        }}
      >
        <Form.Item
          label="级别学期"
          name="courseSemester"
          rules={[{ required: true, message: '请选择级别学期' }]}
        >
          <Select options={convertObjectToArray(TERM)} placeholder="请选择级别学期" />
        </Form.Item>
        <Form.Item
          label="级别名称"
          name="name"
          rules={[{ required: true, message: '请输入级别名称' }]}
        >
          <Input placeholder="请输入级别名称" />
        </Form.Item>
        <Form.Item
          label="级别课时"
          name="courseCount"
          rules={[
            { required: true, message: '请输入级别课时' },
            { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
          ]}
        >
          <Input placeholder="请输入级别课时" />
        </Form.Item>
        <Form.Item
          label="级别价格"
          name="courseOriginPrice"
          rules={[
            { required: true, message: '请输入级别价格' },
            { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
          ]}
        >
          <Input placeholder="请输入级别价格" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditGradeName;
