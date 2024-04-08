import { TERM } from '@/utils/constant';
import { getWholeDateString } from '@/utils/date';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message } from 'antd';
import { TableListItemProps } from './interface';
import { deleteClass } from './services';

export const useInitColumns: any = (
  subjects?: any[],
  checkClass?: (data: TableListItemProps) => void,
  reload?: () => void,
) => {
  // 删除班级
  const delClass = async (r: Partial<TableListItemProps>) => {
    const res = await deleteClass({
      id: r.classId,
      teacherId: r.teacherId,
    });

    if (res?.data) {
      message.success(res?.message || '删除成功');
      reload?.();
    }
  };

  const columns: ProColumns<TableListItemProps>[] = [
    {
      title: '课程类目',
      hideInTable: true,
      valueType: 'cascader',
      formItemProps: {
        name: 'subject',
      },
      fieldProps: {
        options: subjects,
        expandTrigger: 'hover',
        changeOnSelect: true,
      },
      width: 120,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '课程学期',
      dataIndex: 'courseSemester',
      valueEnum: TERM,
      width: 80,
    },
    {
      title: '级别名称',
      dataIndex: 'gradeName',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      hideInSearch: true,
      width: 160,
    },
    {
      title: '教师名称',
      dataIndex: 'teacherName',
      width: 80,
    },
    {
      title: '学生总数',
      dataIndex: 'studentTotal',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createTs',
      hideInSearch: true,
      width: 160,
      renderText: (t) => (t ? getWholeDateString(t) : ''),
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      fixed: 'right',
      width: 180,
      render: (_: any, record: TableListItemProps) =>
        record.status === 99 ? null : (
          <Space>
            <Button
              type="link"
              key="checkClass"
              icon={<EyeOutlined />}
              onClick={() => {
                checkClass?.(record);
              }}
            >
              查看详情
            </Button>
            {(!record?.studentTotal || Number(record?.studentTotal) <= 0) && (
              <Popconfirm
                title="确认删除当前班级？"
                onConfirm={() => {
                  delClass(record);
                }}
              >
                <Button key="delete" type="link" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        ),
    },
  ];

  return columns;
};
