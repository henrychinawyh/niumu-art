import FormatDate from '@/components/Date/FormatDate';
import { GENDER, RELATIONSHIP } from '@/utils/constant';
import { getDateString } from '@/utils/date';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Select } from 'antd';
import { debounce } from 'lodash';
import { useState } from 'react';
import { TableListItemProps } from './interface';
import { getStudent } from './services';

export const useInitColumns: any = (
  editFn?: (data: TableListItemProps) => void,
  deleteFn?: (data: TableListItemProps) => void,
  relateFamilyFn?: (data: TableListItemProps) => void,
) => {
  const [options, setOptions] = useState([]);

  // 模糊查询学员
  const queryStudent = debounce(async (value: string) => {
    if (!value) {
      setOptions([]);
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

  const columns: ProColumns<TableListItemProps>[] = [
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
      valueEnum: GENDER,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
    },
    {
      title: '是否有兄妹',
      dataIndex: 'hasCousin',
      valueEnum: RELATIONSHIP,
      renderText: (t) => {
        if (t && typeof t === 'string') {
          return t
            ?.split(',')
            .map((item: string) => RELATIONSHIP[Number(item) as keyof typeof RELATIONSHIP]);
        } else {
          return '--';
        }
      },
    },
    {
      title: '就读学校',
      dataIndex: 'schoolName',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        1: '有效',
        99: '删除',
      },
      valueType: 'select',
      hideInTable: true,
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
      hideInSearch: true,
      renderText: (t: any) => <FormatDate time={t} />,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTs',
      hideInSearch: true,
      renderText: (t: any) => <FormatDate time={t} />,
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
                size="small"
                onClick={() => {
                  editFn?.(record);
                }}
              >
                编辑
              </Button>,
              !record.familyId && (
                <Button
                  key="relateFamily"
                  type="link"
                  size="small"
                  onClick={() => {
                    relateFamilyFn?.(record);
                  }}
                >
                  关联家庭
                </Button>
              ),
              <Popconfirm
                key="delete"
                title="请确认是否要删除此位学员？"
                onConfirm={() => {
                  deleteFn?.(record);
                }}
              >
                <Button type="link" danger size="small">
                  删除
                </Button>
              </Popconfirm>,
            ],
    },
  ];

  return columns;
};
