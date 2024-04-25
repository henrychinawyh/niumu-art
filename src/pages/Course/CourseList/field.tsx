import useCountDown from '@/hooks/useCountDown';
import { getWholeDateString } from '@/utils/date';
import { Button, Popconfirm } from 'antd';
import { TableListItemProps } from './interface';

export const useInitColumns: any = (
  editFn?: (data: TableListItemProps) => void,
  deleteFn?: (id: string) => void,
) => {
  const [seconds, isActive, start, reset] = useCountDown(5);

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
                title="删除课程会将其下所有的级别，班级，学员一并删除，请谨慎操作！"
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
