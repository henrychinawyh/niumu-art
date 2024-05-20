import { ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { TableListItemProps } from './interface';

export const useInitColumns: any = (
  subjects?: [],
  editFn?: (data: TableListItemProps) => void,
  checkClass?: (data: TableListItemProps) => void,
) => {
  const columns: ProColumns<TableListItemProps>[] = [
    {
      title: '课程类目',
      hideInTable: true,
      valueType: 'cascader',
      fieldProps: {
        name: 'subject',
        options: subjects,
        expandTrigger: 'hover',
        changeOnSelect: true,
      },
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '级别名称',
      dataIndex: 'gradeName',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '教师名称',
      dataIndex: 'teacherName',
      width: 100,
    },
    {
      title: '学生总数',
      dataIndex: 'total',
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
                type="link"
                key="checkClass"
                onClick={() => {
                  checkClass?.(record);
                }}
              >
                查看班级详情
              </Button>,
              <Button
                key="edit"
                type="link"
                onClick={() => {
                  editFn?.(record);
                }}
              >
                编辑
              </Button>,
            ],
    },
  ];

  return columns;
};
