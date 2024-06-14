/**
 * @name 家庭列表
 */

import { ActionType, ProFormInstance, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { queryList } from '../services';
import Charge from './components/charge';
import { useInitColumns } from './field';
import { ChargeType, TableListItemProps } from './interface';

const FamilyList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [data, setData] = useState<Partial<TableListItemProps>>({}); // 家庭信息
  const [chargeVis, setChargeVis] = useState(false); // 充值弹框
  const [type, setType] = useState<ChargeType>(); // 充值类型

  const columns = useInitColumns((type: ChargeType, rowData: TableListItemProps) => {
    setType(type);
    setData(rowData);
    setChargeVis(true);
  });

  return (
    <div>
      <ProTable<Partial<TableListItemProps>>
        actionRef={tableRef}
        formRef={formRef}
        rowKey="id"
        request={async (params) => {
          const res = await queryList(params);

          return {
            data: res.data.list,
            total: res.data.total || 0,
            success: res.code === '000',
          };
        }}
        pagination={{
          defaultPageSize: 10,
        }}
        columns={columns}
        options={false}
        tableAlertRender={false}
      />

      <Charge
        visible={chargeVis}
        onCancel={(status) => {
          if (status) {
            tableRef.current?.reload();
          }

          setChargeVis(false);
        }}
        type={type}
        data={data}
      />
    </div>
  );
};

export default FamilyList;
