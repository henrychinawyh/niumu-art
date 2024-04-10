import { getDateString, getWholeDateString } from '@/utils/date';
import { Button, Popconfirm, Select } from 'antd';
import { debounce } from 'lodash';
import { useState } from 'react';
import { TableListItemProps } from './interface';
import { getStudent } from './services';

export const useInitColumns: any = (
  editFn?: (data: TableListItemProps) => void,
  deleteFn?: (id: string) => void,
) => {
  const [options, setOptions] = useState([]);

  // 模糊查询学员
  const queryStudent = debounce(async (value: string) => {
    if (!value) {
      return null;
    } else {
      const res = await getStudent({
        stuName: value,
      });

      if (res.code === '000') {
        setOptions(
          res.data?.map((item: any) => ({
            label: item.stuName,
            value: item.stuName,
          })),
        );
      }
    }
  }, 300);

  const columns = [
    {
      title: '学员姓名',
      dataIndex: 'stuName',
      renderFormItem: () => {
        return (
          <Select
            options={options}
            showSearch={true}
            placeholder="请输入学员名称"
            filterOption={false}
            onSearch={(value) => queryStudent(value)}
            allowClear
          />
        );
      },
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
        r.createTs ? getWholeDateString(r.createTs) : '',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTs',
      hideInSearch: true,
      renderText: (t: any) => (t ? getWholeDateString(t) : ''),
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
