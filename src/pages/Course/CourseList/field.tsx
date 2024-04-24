import { getWholeDateString } from '@/utils/date';
import { Button, Popconfirm } from 'antd';
import { TableListItemProps } from './interface';

export const useInitColumns: any = (
  editFn?: (data: TableListItemProps) => void,
  deleteFn?: (id: string) => void,
) => {
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'name',
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
                onClick={() => {
                  editFn?.(record);
                }}
              >
                编辑
              </Button>,
              <Popconfirm
                key="delete"
                title="请确认是否要删除此位学员？"
                onConfirm={() => {
                  deleteFn?.(`${record.id}`);
                }}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>,
            ],
    },
  ];

  return columns;
};
