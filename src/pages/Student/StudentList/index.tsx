/* eslint-disable @typescript-eslint/no-use-before-define */
import { downloadExcel } from '@/utils';
import { ActionType, PageContainer, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import React, { useRef } from 'react';
import CreateOrEdit from './components/createOrEdit';
import { useInitColumns } from './field';
import { TableListItemProps } from './interface';
import { deleteStudent, exportStudent, getStudentList } from './services';

const StudentList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<TableListItemProps[]>([]);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [data, setData] = React.useState<TableListItemProps>();
  const [type, setType] = React.useState<'create' | 'edit'>('create');
  const columns = useInitColumns(
    (data: TableListItemProps) => {
      setVisible(true);
      setType('edit');
      setData(data);
    },
    (id: string) => {
      delStudent(id);
    },
  );

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

  // 删除学员
  const delStudent = async (ids: string | string[]) => {
    const res = await deleteStudent({
      ids,
    });
    if (res.code === '000') {
      message.success('删除成功');
      tableRef.current?.reload();
    }
  };

  // 导出学员
  const exportStudents = async () => {
    const values = await formRef.current?.validateFields();

    message.loading('正在导出...', 0);
    const res = await exportStudent(values);
    message.destroy();

    downloadExcel(res, '学员列表.xlsx');
  };

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
        request={async (params) => {
          resetKeysAndRows();
          const res = await getStudentList(params);

          return {
            data: res.code === '000' ? res.data.list : [],
            total: res.code === '000' ? res.data.total : 0,
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
          <Popconfirm
            key="batchDelete"
            title="请确认是否要删除选中学员"
            onConfirm={() => delStudent(selectedKeys)}
          >
            <Button type="primary" danger disabled={!selectedRows.length}>
              批量删除学员
            </Button>
          </Popconfirm>,
          <Button key="export" onClick={exportStudents}>
            导出学员
          </Button>,
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
