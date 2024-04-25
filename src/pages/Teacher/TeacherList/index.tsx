/* eslint-disable @typescript-eslint/no-use-before-define */
import { downloadExcel, getTotalWidth } from '@/utils';
import { ActionType, PageContainer, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import React, { useRef } from 'react';
import CreateOrEdit from './components/createOrEdit';
import { useInitColumns } from './field';
import { TableListItemProps } from './interface';
import { deleteTeacher, exportTeacher, getTeacherList } from './services';

const TeacherList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<TableListItemProps[]>([]);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Partial<TableListItemProps> | null>(null);
  const [type, setType] = React.useState<'create' | 'edit'>('create');
  const [columns, courseOptions] = useInitColumns(
    (data: TableListItemProps) => {
      setVisible(true);
      setType('edit');
      setData(data);
    },
    (id: string) => {
      delTeacher(id);
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

  // 删除教师
  const delTeacher = async (ids: string | string[]) => {
    const res = await deleteTeacher({
      ids,
    });
    if (res.code === '000') {
      message.success('删除成功');
      tableRef.current?.reload();
    }
  };

  // 导出教师
  const exportTeachers = async () => {
    const values = await formRef.current?.validateFields();

    message.loading('正在导出...', 0);
    const res = await exportTeacher(values);
    message.destroy();

    downloadExcel(res, '教师列表.xlsx');
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
          const res = await getTeacherList(params);

          return {
            data: res.code === '000' ? res.data?.list : [],
            total: res.code === '000' ? res.data?.total : 0,
            success: res.code === '000',
          };
        }}
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
            新增教师
          </Button>,
          <Popconfirm
            key="batchDelete"
            title="请确认是否要删除选中教师"
            onConfirm={() => delTeacher(selectedKeys)}
          >
            <Button type="primary" danger disabled={!selectedRows.length}>
              批量删除教师
            </Button>
          </Popconfirm>,
          <Button key="export" onClick={exportTeachers}>
            导出教师
          </Button>,
        ]}
        options={false}
        rowSelection={rowSelection}
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
          options={courseOptions}
        />
      )}
    </PageContainer>
  );
};

export default TeacherList;
