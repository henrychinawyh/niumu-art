/**
 * @name 添加课时
 */

import {
  ModalForm,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { floor } from 'lodash';
import styles from '../index.less';
import { StudentProps, TableListItemProps } from '../interface';
import { addCourseClass } from '../services';

type StringOrNumber = string | number;

interface SubmitProps<T> {
  courses: Array<CreateClassCourseParams<T>>;
  [keys: string]: any;
}

interface CreateClassCourseParams<T> {
  paidCourseCount: T;
  totalPayment: T;
  payment: T;
  eachCoursePrice: T;
  discount: T;
  students: Array<StudentProps>;
  studentId: T;
  accountBalance: T;
  studentName: T;
}

interface AddClassCourseProps {
  students: Array<StudentProps>;
  data: Partial<TableListItemProps> | null;
  visible: boolean;
  onCancel?: (refresh?: boolean) => void;
  [key: string]: any;
}

const AddClassCourse: React.FC<AddClassCourseProps> = (props) => {
  const { students, visible, onCancel, data } = props;

  const [form] = Form.useForm();

  return (
    <ModalForm<SubmitProps<StringOrNumber>>
      title={'批量添加课时'}
      modalProps={{
        onCancel: () => {
          onCancel?.();
        },
        destroyOnClose: true,
        maskClosable: false,
      }}
      form={form}
      width={900}
      open={visible}
      autoFocusFirstInput
      grid
      rowProps={{
        gutter: 10,
      }}
      className={styles.batchAddCourses}
      initialValues={{
        courses: students?.map((item) => ({
          studentClassId: item.id,
          paidCourseCount: data?.courseCount,
          studentName: item.stuName,
          studentId: item.studentId,
          eachCoursePrice: data?.eachCoursePrice,
          discount: item.discount,
          totalPayment: data?.courseOriginPrice,
          realPrice: floor(Number(data?.eachCoursePrice) * Number(item.discount), 2),
          payment: floor(Number(data?.courseOriginPrice) * Number(item.discount), 2),
          classId: item.classId,
          payId: item.payId,
          isMember: item.isMember,
        })),
      }}
      onValuesChange={(changeValues, values) => {
        if (Array.isArray(changeValues?.courses) && changeValues.courses.length > 0) {
          const index = changeValues.courses.findIndex(
            (item: CreateClassCourseParams<StringOrNumber>) => !!item,
          );
          const { paidCourseCount, eachCoursePrice, discount } = values?.courses?.[index] || {};

          // 原价
          form.setFieldValue(
            ['courses', index, 'totalPayment'],
            floor(Number(paidCourseCount) * Number(eachCoursePrice), 2),
          );

          // 折扣总价
          form.setFieldValue(
            ['courses', index, 'payment'],
            floor(Number(paidCourseCount) * Number(eachCoursePrice) * Number(discount), 2),
          );
        }
      }}
      onFinish={async (values: SubmitProps<StringOrNumber>) => {
        let disabledArr: string[] = [];

        values.courses.forEach((item: CreateClassCourseParams<StringOrNumber>) => {
          const accountBalance = students?.filter(
            (student) => +student.studentId === +item.studentId,
          )?.[0]?.accountBalance;

          if (+accountBalance < +item.payment) {
            disabledArr.push(item.studentName as string);
          }
        });

        if (disabledArr.length > 0) {
          message.error(
            `以下学员（${disabledArr.join(',')}）余额不足，请调整学员课时或调整学员账户余额`,
          );
          return false;
        }

        const res = await addCourseClass(values);

        if (res?.data?.data) {
          message.success(res?.data?.message || '新建成功');
          onCancel?.(true);
        }

        return true;
      }}
    >
      <ProFormList
        name="courses"
        copyIconProps={false}
        creatorButtonProps={{
          style: { display: 'none' },
        }}
      >
        <ProFormGroup key="addCourses">
          {/* 隐藏 */}
          <ProFormText
            label="学员-班级关联id"
            hidden
            name="studentClassId"
            colProps={{ span: 0 }}
          />
          <ProFormText label="学员id" hidden name="studentId" colProps={{ span: 0 }} />
          <ProFormText label="班级id" hidden name="classId" colProps={{ span: 0 }} />
          <ProFormText label="支付课程记录id" hidden name="payId" colProps={{ span: 0 }} />
          <ProFormText label="是否会员" hidden name="isMember" colProps={{ span: 0 }} />

          {/*  */}
          <ProFormText label="学员姓名" name="studentName" colProps={{ span: 3 }} disabled />
          <ProFormText
            label="课时数量(节)"
            name="paidCourseCount"
            colProps={{ span: 4 }}
            rules={[{ required: true, message: '请输入课时数量' }]}
          />
          <ProFormDependency name={['studentId']}>
            {({ studentId }) => {
              const discount = students?.filter((item) => item.id === studentId)?.[0]?.discount;

              return (
                <ProFormText
                  label="会员折扣"
                  name="discount"
                  colProps={{ span: 3 }}
                  disabled
                  hidden={+discount === 1}
                />
              );
            }}
          </ProFormDependency>
          <ProFormDigit label="课时原单价" name="eachCoursePrice" colProps={{ span: 3 }} disabled />
          <ProFormDigit label="课时原价(元)" name="totalPayment" colProps={{ span: 4 }} disabled />
          <ProFormDigit label="折扣单价(元)" name="realPrice" colProps={{ span: 3 }} disabled />
          <ProFormDigit label="折扣总价(元)" name="payment" colProps={{ span: 4 }} disabled />
        </ProFormGroup>
      </ProFormList>
    </ModalForm>
  );
};

export default AddClassCourse;
