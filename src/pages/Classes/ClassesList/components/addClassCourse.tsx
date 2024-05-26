/**
 * @name 添加课时
 */

import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { addCourseClass } from '../services';

type StringOrNumber = string | number;

interface StudentProps<T> {
  id: T;
  studentId: T;
  remainCourseCount: T;
  payId: T;
}

interface CreateClassCourseParams<T> {
  paidCourseCount: T;
  payment: T;
  students: Array<StudentProps<T>>;
}

interface AddClassCourseProps {
  students: Array<StudentProps<number | string>>;
  visible: boolean;
  onCancel?: (refresh?: boolean) => void;
  [key: string]: any;
}

const AddClassCourse: React.FC<AddClassCourseProps> = (props) => {
  const { students, visible, onCancel } = props;

  return (
    <ModalForm<CreateClassCourseParams<StringOrNumber>>
      title={'批量添加课时'}
      modalProps={{
        onCancel: () => {
          onCancel?.();
        },
        destroyOnClose: true,
        maskClosable: false,
        width: 450,
      }}
      open={visible}
      autoFocusFirstInput
      layout="horizontal"
      grid
      rowProps={{
        gutter: 10,
      }}
      onFinish={async (values: CreateClassCourseParams<StringOrNumber>) => {
        const params: CreateClassCourseParams<StringOrNumber> = {
          ...values,
          students,
        };

        const res = await addCourseClass(params);

        if (res?.data?.data) {
          message.success(res?.data?.message || '新建成功');
          onCancel?.(true);
        }

        return true;
      }}
    >
      <ProFormText
        label="课时数量(节)"
        name="paidCourseCount"
        colProps={{ span: 24 }}
        rules={[{ required: true, message: '请输入课时数量' }]}
      />
      <ProFormText
        label="课时总价格(元)"
        name="payment"
        colProps={{ span: 24 }}
        rules={[{ required: true, message: '请输入课时总价格' }]}
      />
    </ModalForm>
  );
};

export default AddClassCourse;
