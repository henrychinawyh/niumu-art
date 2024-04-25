import useCountDown from '@/hooks/useCountDown';
import { getAllCourseList, getCourseGrade } from '@/pages/Course/CourseList/services';
import { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useState } from 'react';
import { TableListItemProps } from './interface';

export const useInitColumns: any = (
  editFn?: (data: TableListItemProps) => void,
  deleteFn?: (id: string) => void,
  formRef?: React.MutableRefObject<ProFormInstance | undefined>,
) => {
  const [seconds, isActive, start, reset] = useCountDown(5);

  const [courses, setCourses] = useState<DefaultOptionType[]>([]); // 获取课程
  const [grades, setGrades] = useState<DefaultOptionType[]>([]); // 获取课程下的级别
  const [classes, setClasses] = useState<DefaultOptionType[]>([]); // 获取级别下的班级

  useEffect(() => {
    getAllCourseList({}).then((res) => [setCourses(res?.data || [])]);
  }, []);

  // 切换课程时获取当前课程下的级别
  const changeCourse = async (val: number) => {
    setGrades([]);
    setClasses([]);
    formRef?.current?.resetFields(['gradeId', 'classId']);

    if (val) {
      const res = await getCourseGrade({
        courseId: val,
      });

      setGrades(res?.data?.list);
    }
  };

  // 切换级别时获取当前级别下的班级
  const changeGrade = async (val: number) => {
    setClasses([]);

    if (val) {
    } else {
    }
  };

  const columns: ProColumns<TableListItemProps>[] = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      valueType: 'select',
      formItemProps: {
        name: 'courseId',
      },
      fieldProps: {
        options: courses,
        onChange: (val: number) => changeCourse(val),
      },
      width: 100,
    },
    {
      title: '级别名称',
      dataIndex: 'gradeName',
      valueType: 'select',
      formItemProps: {
        name: 'gradeId',
      },
      fieldProps: {
        options: grades,
        onChange: (val: number) => changeGrade(val),
      },
      width: 100,
    },
    {
      title: '班级名称',
      dataIndex: 'name',
      valueType: 'select',
      formItemProps: {
        name: 'classId',
      },
      fieldProps: {
        options: classes,
      },
      width: 100,
    },
    {
      title: '教师名称',
      dataIndex: 'teaName',
      width: 100,
    },
    {
      title: '学生总数',
      dataIndex: 'stuTotal',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      width: 120,
      render: (_: any, record: TableListItemProps) =>
        record.status === 99
          ? null
          : [
              <Button
                key="edit"
                type="link"
                onClick={() => {
                  editFn?.(record);
                }}
              >
                编辑
              </Button>,
              <Popconfirm
                key="delete"
                title="删除班级会将其下所有学员和教师一并删除，请谨慎操作！"
                onConfirm={() => {
                  deleteFn?.(`${record.id}`);
                }}
                okButtonProps={{
                  disabled: isActive,
                }}
                okText={isActive ? `确定(${seconds}s)` : '确定'}
              >
                <Button
                  type="link"
                  danger
                  onClick={() => {
                    reset();
                    start();
                  }}
                >
                  删除
                </Button>
              </Popconfirm>,
            ],
    },
  ];

  return columns;
};
