import { getWholeDateString } from '@/utils/date';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { TableListItemProps } from './interface';

export const useInitColumns: any = (
  editFn?: (data: TableListItemProps) => void,
  deleteFn?: (id: number) => void,
  addGradeFn?: (id: number) => void,
) => {
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'name',
    },
    {
      title: '课程学员人数(人)',
      dataIndex: 'courseStuTotal',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTs',
      valueType: 'date',
      hideInSearch: true,
      render: (dom: any, r: TableListItemProps) =>
        r.createTs ? getWholeDateString(r.createTs) : '',
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      render: (_: any, record: TableListItemProps) =>
        record.status === 99
          ? null
          : [
              <Button
                key="edit"
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  editFn?.(record);
                }}
              >
                编辑
              </Button>,
              <Button
                type="link"
                key="addGrade"
                onClick={() => {
                  addGradeFn?.(record?.id);
                }}
              >
                添加级别
              </Button>,
              record.courseStuTotal <= 0 && (
                <Popconfirm
                  key="delete"
                  title="删除班级"
                  onConfirm={() => {
                    deleteFn?.(record.id);
                  }}
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              ),
            ],
    },
  ];

  return columns;
};
