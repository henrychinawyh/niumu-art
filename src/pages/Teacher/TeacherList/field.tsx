import { getDateString, getWholeDateString } from '@/utils/date';
import { Button, Popconfirm } from 'antd';
import { TableListItemProps } from './interface';

export const useInitColumns: any = (
  editFn?: (data: TableListItemProps) => void,
  deleteFn?: (id: string) => void,
) => {
  const columns = [
    {
      title: '教师名称',
      dataIndex: 'teaName',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      hideInSearch: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: {
        1: '男',
        2: '女',
      },
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        1: '有效',
        99: '删除',
      },
      valueType: 'select',
      initialValue: '1',
    },
    {
      title: '生日',
      dataIndex: 'birthDate',
      hideInSearch: true,
      render: (t: any) => (t ? getDateString(t) : ''),
    },
    {
      title: '创建时间',
      dataIndex: 'createTs',
      valueType: 'date',
      hideInSearch: true,
      render: (dom: any, r: TableListItemProps) =>
        r.createTs ? getWholeDateString(r.createTs) : '--',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTs',
      hideInSearch: true,
      render: (dom: any, r: TableListItemProps) =>
        r.updateTs ? getWholeDateString(r.updateTs) : '--',
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
                title="请确认是否要删除此位教师？"
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
