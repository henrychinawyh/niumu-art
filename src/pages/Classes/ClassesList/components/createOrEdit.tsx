import { getAllSubjects } from '@/pages/Course/CourseList/services';
import { getStudent } from '@/pages/Student/StudentList/services';
import { queryTeacherWithCourse } from '@/pages/Teacher/TeacherList/services';
import { ModalForm, ProFormCascader, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { CreateClassParams, TableListItemProps } from '../interface';
import { createClass } from '../services';

interface IProps {
  title: string;
  onCancel: (refresh?: boolean) => void;
  visible: boolean;
  data?: Partial<TableListItemProps> | null;
}

const CreateOrEdit: React.FC<IProps> = (props) => {
  const { data, title, visible, onCancel } = props ?? {};
  const [form] = Form.useForm<CreateClassParams>();

  const [teachers, setTeachers] = useState<DefaultOptionType[]>([]);
  const [students, setStudents] = useState<DefaultOptionType[]>([]);

  const [defaultStudents, setDefaultStudents] = useState<DefaultOptionType[]>([]);

  useEffect(() => {
    // 回填任课教师以及班级学员
    if (data) {
      if (data.courseId) {
        changeSubject(data.courseId);
      }

      if (Array.isArray(data.studentList)) {
        setDefaultStudents(
          data.studentList.map((item) => ({
            label: item.name,
            value: item.studentId,
            disabled: true,
          })),
        );
        setStudents(
          data.studentList.map((item) => ({
            label: item.name,
            value: item.studentId,
            disabled: true,
          })),
        );
      }
    }
  }, [data]);

  // 切换课程类目后搜索任课教师
  const changeSubject = async (val: number) => {
    const res = await queryTeacherWithCourse({ courseId: val });
    setTeachers(res?.data || []);
  };

  // 搜索学员
  const searchStudent = debounce(async (val: string) => {
    if (val) {
      const res = await getStudent({ stuName: val });

      setStudents(
        (defaultStudents?.length > 0 ? students : []).concat(
          res?.data
            ?.filter((item: any) => !students.find((s) => s.value === item.id))
            ?.map((item: any) => ({
              label: item.stuName,
              value: item.id,
            })),
        ),
      );
    }
  }, 400);

  return (
    <ModalForm<CreateClassParams>
      title={title}
      modalProps={{
        onCancel: () => {
          onCancel();
        },
        destroyOnClose: true,
        maskClosable: false,
        width: 450,
      }}
      visible={visible}
      autoFocusFirstInput
      form={form}
      initialValues={{
        name: data?.className,
        subject:
          data?.courseId && data?.gradeId
            ? [data?.courseId, data?.courseSemester, data?.gradeId]
            : [],
        teacherId: data?.teacherId,
        studentIds: data?.studentList?.map((item) => item.studentId) || [],
      }}
      onFinish={async (values: any) => {
        const [courseId, courseSemester, gradeId] = values.subject || [];

        const params: Partial<CreateClassParams> = {
          ...values,
          courseId,
          gradeId,
          courseSemester,
        };

        delete (params as any).subject;

        try {
          const res = await createClass(params);
          if (res.data) {
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
        colProps={{ span: 24 }}
        rules={[
          { required: true, message: '班级名称必填' },
          {
            max: 10,
            message: '班级名称不能超过10个字符',
          },
        ]}
      />

      <ProFormCascader
        label="课程类目"
        name="subject"
        rules={[{ required: true, message: '班级名称必填' }]}
        colProps={{ span: 24 }}
        fieldProps={{
          expandTrigger: 'hover',
          onChange: (val: any[]) => {
            if (val?.[0]) {
              changeSubject(val?.[0]);
            }

            setTeachers([]);
            form.setFieldsValue({
              teacherId: undefined,
            });
          },
        }}
        request={async () => {
          const res = await getAllSubjects();

          return res?.data || [];
        }}
      />

      <ProFormSelect
        label="任课教师"
        name="teacherId"
        colProps={{ span: 24 }}
        rules={[{ required: true, message: '任课教师必选' }]}
        options={teachers}
      />

      <ProFormSelect
        label="班级学员"
        name="studentIds"
        colProps={{ span: 24 }}
        rules={[{ required: true, message: '班级学员必选' }]}
        debounceTime={400}
        fieldProps={{
          allowClear: false,
          filterOption: false,
          mode: 'multiple',
          onSearch: searchStudent,
          // maxTagCount: 3,
          placeholder: '输入搜索班级学员',
        }}
        showSearch
        options={students}
      />
    </ModalForm>
  );
};

export default CreateOrEdit;
