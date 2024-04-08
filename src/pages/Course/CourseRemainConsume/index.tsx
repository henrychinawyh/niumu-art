/**
 * @name 课程课销表
 */

import { ActionType, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef } from 'react';
import { useInitColumns } from './field';
import { TableListItemProps } from './interface';

const CourseRemainConsume: React.FC<any> = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const columns = useInitColumns();

  return (
    <div>
      <ProTable<TableListItemProps>
        actionRef={tableRef}
        formRef={formRef}
        rowKey="id"
        request={async (params) => {
          // const res = await getCourseList(params);
          // return {
          //   data: res.code === '000' ? res.data.list : [],
          //   total: res.code === '000' ? res.data.total : 0,
          //   success: res.code === '000',
          // };
          return {
            success: true,
            data: [],
          };
        }}
        pagination={{
          defaultPageSize: 10,
        }}
        columns={columns}
        toolBarRender={() => [
          <Button key="export" type="primary" onClick={() => {}}>
            导出课销表
          </Button>,
        ]}
        options={false}
        tableAlertRender={false}
      />
    </div>
  );
};

export default CourseRemainConsume;
