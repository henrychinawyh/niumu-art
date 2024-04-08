/**
 * @name 转班
 */

import useGetAllSubjects from '@/hooks/useGetAllSubjects';
import { getCourseDetail } from '@/pages/Course/CourseList/services';
import {
  ModalForm,
  ProFormCascader,
  ProFormDependency,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, Space, message } from 'antd';
import { floor } from 'lodash';
import { useState } from 'react';
import { changeClass } from '../services';

interface IProps {
  visible: boolean;
  onCancel?: (refresh?: boolean) => void;
  onOk?: (data: any) => void;
  data?: any;
  [keys: string]: any;
}

const SwitchClass: React.FC<IProps> = (props) => {
  const { onCancel, visible, data } = props;
  const [form] = Form.useForm();
  const subjects = useGetAllSubjects(4);
  const [courseDetail, setCourseDetail] = useState<any>(null); // 课程详情

  const [canSwitch, setCanSwitch] = useState<boolean>(true); // 是否可以转班
  const [loading, setLoading] = useState(false);

  // 查询转班的班级信息
  const queryCourseDetail = async (params: any) => {
    //  查询课程详情
    const res = await getCourseDetail(params);

    if (res?.data?.[0]) {
      setCourseDetail(res?.data?.[0]);
      form.setFieldsValue({
        courseCount: res?.data?.[0]?.courseCount,
      });
    }
  };

  // 转班操作
  const onOk = async (data: any) => {
    setLoading(true);

    const res = await changeClass(data);
    setLoading(false);
    if (res.data) {
      message.success('转班成功');
      onCancel?.(true);
    }
  };

  return (
    <ModalForm
      title="转班"
      form={form}
      open={visible}
      modalProps={{
        destroyOnClose: false,
        maskClosable: false,
        onCancel: () => {
          onCancel?.();
        },
        width: 400,
        confirmLoading: loading,
      }}
      onFinish={async (values) => {
        if (canSwitch) {
          const { courseCount, subject } = values || {};
          const [courseId, courseSemester, gradeId, classId] = subject;

          // 转班相当于在新的班级中增加学员，并删除之前旧班级下的记录

          onOk?.({
            courseCount,
            courseSemester,
            studentId: data?.studentId,
            courseId,
            gradeId,
            classId,
            id: data?.id,
            payId: data?.payId,
            payment:
              +courseCount *
              courseDetail?.eachCoursePrice *
              (data?.isMember === 1 ? +data.discount : 1),
            realPrice: courseDetail?.eachCoursePrice * +data?.discount,
            paidCourseCount: courseCount,
            totalPayment: +courseCount * courseDetail?.eachCoursePrice,
            eachCoursePrice: courseDetail?.eachCoursePrice,
          });
        } else {
          message.warning('账户余额不足，请先充值账户余额或减少课时数量');
          return false;
        }
      }}
    >
      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
      >
        <ProFormCascader
          required
          rules={[
            () => ({
              validator(_, value) {
                if (Array.isArray(value) && value.length === 4) {
                  if (
                    value?.join(',') ===
                    [data?.courseId, data?.courseSemester, data?.gradeId, data?.classId].join(',')
                  ) {
                    return Promise.reject(new Error('不能转入本班级'));
                  }
                  return Promise.resolve();
                }
                return Promise.reject(new Error('请选择到班级一层'));
              },
            }),
          ]}
          label="选择班级"
          placeholder="请选择班级"
          name="subject"
          fieldProps={{
            options: subjects,
            expandTrigger: 'hover',
            onChange: (val: any) => {
              if (Array.isArray(val) && val.length === 4) {
                const [courseId, courseSemester, gradeId] = val || [];
                queryCourseDetail({ courseId, courseSemester, gradeId });
              }
            },
          }}
        />

        {courseDetail && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <ProFormText
              label="新增课时"
              name="courseCount"
              rules={[
                {
                  required: true,
                  message: '请输入新增课时',
                },
                {
                  pattern: /^[1-9]\d*$/,
                  message: '请输入正整数',
                },
              ]}
            />

            <ProFormDependency name={['courseCount']}>
              {({ courseCount }) => {
                let price = 0;
                // 课程总价
                if (+courseCount > 0) {
                  price = floor(
                    courseDetail?.eachCoursePrice *
                      +courseCount *
                      (data?.isMember ? +data?.discount : 1),
                    2,
                  );

                  setCanSwitch(price <= +data?.accountBalance);
                }

                return (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <h4>课时原单价: ￥{courseDetail?.eachCoursePrice}</h4>
                      <h4>
                        享受折扣: {data?.isMember === 1 ? `${+data?.discount * 10}折` : '无折扣'}
                      </h4>
                    </div>
                    <div>
                      <h4>账户余额: ￥{data?.accountBalance}</h4>
                      <h4>课时总价: ￥{+price > 0 ? price.toFixed(2) : '-'}</h4>
                    </div>
                  </Space>
                );
              }}
            </ProFormDependency>
          </Space>
        )}
      </Space>
    </ModalForm>
  );
};

export default SwitchClass;
