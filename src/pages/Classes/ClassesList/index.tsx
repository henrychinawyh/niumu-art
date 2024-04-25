/**
 * @names 班级管理
 */

import { getTotalWidth } from '@/utils';
import { ActionType, PageContainer, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef } from 'react';
import CreateOrEdit from './components/createOrEdit';
import { useInitColumns } from './fields';
import { TableListItemProps } from './interface';

const ClassesList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [visible, setVisible] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Partial<TableListItemProps> | null>(null);
  const [type, setType] = React.useState<'create' | 'edit'>('create');

  const columns = useInitColumns(
    (data: TableListItemProps) => {
      setVisible(true);
      setType('edit');
      setData(data);
    },
    (id: number) => {
      // delTeacher(id);
    },
    formRef,
  );

  // 删除班级
  // const delClass = async (ids: string | string[]) => {
  //   const res = await deleteClass({
  //     ids,
  //   });
  //   if (res.code === '000') {
  //     message.success('删除成功');
  //     tableRef.current?.reload();
  //   }
  // };

  return (
    <PageContainer
      header={{
        title: null,
      }}
    >
      <ProTable<TableListItemProps>
        actionRef={tableRef}
        formRef={formRef}
        rowKey="id"
        // request={async (params) => {
        //   const res = await getTeacherList(params);

        //   return {
        //     data: res.code === '000' ? res.data?.list : [],
        //     total: res.code === '000' ? res.data?.total : 0,
        //     success: res.code === '000',
        //   };
        // }}
        pagination={{
          defaultPageSize: 10,
        }}
        columns={columns}
        scroll={{
          x: getTotalWidth(columns),
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setType('create');
              setData(null);
              setVisible(true);
            }}
          >
            新增班级
          </Button>,
        ]}
        options={false}
        tableAlertRender={false}
      />

      {visible && (
        <CreateOrEdit
          title={type === 'create' ? '新增教师' : '编辑教师'}
          onCancel={(refresh?: boolean) => {
            if (refresh) {
              tableRef.current?.reload();
            }
            setData(null);
            setVisible(false);
          }}
          visible={visible}
          data={data}
          type={type}
        />
      )}
    </PageContainer>
  );
};

export default ClassesList;
