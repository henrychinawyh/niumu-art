import { YES_OR_NO } from '@/utils/constant';
import { getWholeDateString } from '@/utils/date';
import { ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { floor } from 'lodash';
import { ChargeType, TableListItemProps } from './interface';

export const useInitColumns: any = (
  chargeFn: (type: ChargeType, data: TableListItemProps) => void,
  consumeFn: (data: TableListItemProps) => void,
) => {
  const columns: ProColumns<TableListItemProps>[] = [
    {
      title: '序号',
      dataIndex: 'seq',
      hideInSearch: true,
      renderText: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: '家庭名称',
      dataIndex: 'familyName',
    },
    {
      title: '是否会员',
      dataIndex: 'isMember',
      valueEnum: YES_OR_NO,
    },
    {
      title: '会员折扣',
      dataIndex: 'discount',
      hideInSearch: true,
      renderText: (t) => (t < 1 ? `${floor(t * 10, 0)}折(${t})` : '无折扣'),
    },
    {
      title: '账户余额',
      dataIndex: 'accountBalance',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (dom, r) => {
        return r.createTime ? getWholeDateString(r.createTime) : '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'opt',
      hideInSearch: true,
      render: (_: any, record: TableListItemProps) => [
        !record.isMember && (
          <Button
            type="link"
            key="member"
            onClick={() => {
              chargeFn('member', record);
            }}
          >
            办理会员
          </Button>
        ),
        <Button
          type="link"
          key="recharge"
          onClick={() => {
            chargeFn('account', record);
          }}
        >
          充值账户
        </Button>,
        <Button
          type="link"
          key="consume"
          onClick={() => {
            consumeFn(record);
          }}
        >
          消费记录
        </Button>,
      ],
    },
  ];

  return columns;
};
