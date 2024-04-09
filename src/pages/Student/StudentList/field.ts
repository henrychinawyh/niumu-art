import { getDateString, getWholeDateString } from '@/utils/date';
import { ProColumns } from '@ant-design/pro-components';
import { TableListItemProps } from './interface';

export const columns: ProColumns<TableListItemProps>[] = [
  {
    title: '学员姓名',
    dataIndex: 'stuName',
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
      2: '删除',
    },
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
    render: (dom, r) => (r.createTs ? getWholeDateString(r.createTs) : ''),
  },
  {
    title: '更新时间',
    dataIndex: 'updateTs',
    hideInSearch: true,
    renderText: (t: any) => (t ? getWholeDateString(t) : ''),
  },
];
