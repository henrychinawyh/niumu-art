import ReactCopyToClipBoard from '@/components/ReactCopyToClipBoard';
import { getAllCourseList } from '@/pages/Course/CourseList/services';
import { getDateString, getWholeDateString } from '@/utils/date';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { TableListItemProps } from './interface';

export const useInitColumns: any = (
  editFn?: (data: TableListItemProps) => void,
  deleteFn?: (id: string) => void,
) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getAllCourseList({}).then((res) => {
      setOptions(res.data);
    });
  }, []);

  const columns: ProColumns<TableListItemProps>[] = [
    {
      title: '教师名称',
      dataIndex: 'teaName',
      width: 80,
    },
    {
      title: '任职课程',
      dataIndex: 'courseName',
      valueType: 'select',
      formItemProps: {
        name: 'courseId',
      },
      fieldProps: {
        options,
      },
      width: 80,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      hideInSearch: true,
      width: 60,
    },
    {
      title: (
        <Space size={4}>
          <span>手机号</span>
          <Tooltip title="点击手机号可复制">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'phoneNumber',
      hideInSearch: true,
      width: 120,
      render: (t: any) => (t ? <ReactCopyToClipBoard>{t}</ReactCopyToClipBoard> : '--'),
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: {
        1: '男',
        2: '女',
      },
      width: 60,
    },
    {
      title: (
        <Space size={4}>
          <span>身份证号</span>
          <Tooltip title="点击身份证号可复制">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'idCard',
      width: 95,
      render: (t: any) => (t ? <ReactCopyToClipBoard>{t}</ReactCopyToClipBoard> : '--'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        1: '有效',
        99: '删除',
      },
      valueType: 'select',
      initialValue: 1,
      width: 100,
    },
    {
      title: '生日',
      dataIndex: 'birthDate',
      hideInSearch: true,
      render: (t: any) => (t ? getDateString(t) : ''),
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTs',
      valueType: 'date',
      hideInSearch: true,
      render: (dom: any, r: TableListItemProps) =>
        r.createTs ? getWholeDateString(r.createTs) : '--',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTs',
      hideInSearch: true,
      render: (dom: any, r: TableListItemProps) =>
        r.updateTs ? getWholeDateString(r.updateTs) : '--',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      fixed: 'right',
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
      width: 130,
    },
  ];

  return [columns, options];
};
