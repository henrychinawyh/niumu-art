import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef } from 'react';
import CreateOrEdit from './components/createOrEdit';
import { columns } from './field';
import { TableListItemProps } from './interface';
import { getStudentList } from './services';

const StudentList: React.FC = () => {
  const tableRef = useRef<ActionType>();

  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<TableListItemProps[]>([]);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [data, setData] = React.useState<TableListItemProps>();
  const [type, setType] = React.useState<'create' | 'edit'>('create');

  const rowSelection: any = {
    selectedRowKeys: selectedKeys,
    onChange: (keys: string[], rows: TableListItemProps[]) => {
      setSelectedKeys(keys);
      setSelectedRows(rows);
    },
  };

  const resetKeysAndRows = () => {
    setSelectedKeys([]);
    setSelectedRows([]);
  };

  return (
    <PageContainer
      header={{
        title: null,
      }}
    >
      <ProTable<TableListItemProps>
        actionRef={tableRef}
        rowKey="id"
        request={async (params) => {
          resetKeysAndRows();
          const res = await getStudentList(params);
          return {
            data: res.code === '000' ? res.data : [],
            success: res.code === '000',
          };
        }}
        pagination={{
          defaultPageSize: 10,
        }}
        columns={columns}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setVisible(true);
              setType('create');
              setData(undefined);
            }}
          >
            新增学员
          </Button>,
          <Button key="batchDelete" type="primary" danger disabled={!selectedRows.length}>
            批量删除学员
          </Button>,
          <Button key="export">导出学员</Button>,
        ]}
        options={false}
        rowSelection={rowSelection}
        tableAlertRender={false}
      />

      <CreateOrEdit
        title={type === 'create' ? '新增学员' : '编辑学员'}
        onCancel={(refresh?: boolean) => {
          if (refresh) {
            tableRef.current?.reload();
          }

          setVisible(false);
        }}
        visible={visible}
        data={data}
        type={type}
      />
    </PageContainer>
  );
};

export default StudentList;
