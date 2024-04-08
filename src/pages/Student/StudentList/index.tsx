/* eslint-disable @typescript-eslint/no-use-before-define */
import { downloadExcel, getTotalWidth } from '@/utils';
import { ActionType, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import React, { useRef, useState } from 'react';
import CheckConsumeRecord from './components/checkConsumeRecord';
import CreateOrEdit from './components/createOrEdit';
import ExtraCost from './components/extraCost';
import RelateFamily from './components/relateFamily';
import Surplus from './components/surplus';
import { useInitColumns } from './field';
import { TableListItemProps } from './interface';
import { deleteStudent, exportStudent, getStudentList } from './services';

const StudentList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<TableListItemProps[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<Partial<TableListItemProps> | null>(null);
  const [type, setType] = useState<'create' | 'edit'>('create');

  // 关联家庭
  const [relateVis, setRelateVis] = useState(false);

  // 批量课外消费
  const [extraVis, setExtraVis] = useState(false);

  // 查看消费记录
  const [consumeVis, setConsumeVis] = useState(false);

  // 查看剩余课销
  const [surplusVis, setSurplusVis] = useState(false);

  const columns = useInitColumns(
    (data: TableListItemProps) => {
      setVisible(true);
      setType('edit');
      setData(data);
    },
    (data: TableListItemProps) => {
      delStudent([
        {
          studentId: data.id,
          familyId: data.familyId,
          isMain: data.isMain,
        },
      ]);
    },
    (data: TableListItemProps) => {
      setRelateVis(true);
      setData(data);
    },
    (data: TableListItemProps) => {
      setConsumeVis(true);
      setData(data);
    },
    (data: TableListItemProps) => {
      setSurplusVis(true);
      setData(data);
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
  const delStudent = async (data: any[]) => {
    const res = await deleteStudent(data);
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
    <div>
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
        scroll={{
          x: getTotalWidth(columns),
        }}
        columns={columns}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setVisible(true);
              setType('create');
              setData(null);
            }}
          >
            新增学员
          </Button>,
          <Popconfirm
            key="batchDelete"
            title="请确认是否要删除选中学员"
            onConfirm={() =>
              delStudent(
                selectedRows.map((item) => ({
                  studentId: item.id,
                  familyId: item.familyId,
                  isMain: item.isMain,
                })),
              )
            }
          >
            <Button type="primary" danger disabled={!selectedRows.length}>
              批量删除学员
            </Button>
          </Popconfirm>,
          <Button key="export" onClick={exportStudents}>
            导出学员
          </Button>,
          <Button
            key="export"
            disabled={!selectedRows.length}
            onClick={() => {
              if (selectedRows.every((item) => item.familyId)) {
                setExtraVis(true);
              } else {
                message.error('请确认选中的学员中是否都关联了家庭');
              }
            }}
          >
            批量新增消费
          </Button>,
        ]}
        options={false}
        rowSelection={rowSelection}
        tableAlertRender={false}
      />

      {/* 创建，编辑学员 */}
      {visible && (
        <CreateOrEdit
          title={type === 'create' ? '新增学员' : '编辑学员'}
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

      {/* 关联家庭 */}
      {relateVis && (
        <RelateFamily
          onCancel={(refresh) => {
            setRelateVis(false);

            if (refresh) {
              tableRef.current?.reload();
            }
          }}
          visible={relateVis}
          data={data}
        />
      )}

      {/* 批量课外消费 */}
      {extraVis && (
        <ExtraCost
          visible={extraVis}
          onCancel={(status) => {
            setExtraVis(false);
            if (status) {
              tableRef.current?.reload();
            }
          }}
          datas={selectedRows}
        />
      )}

      {/* 查看消费记录 */}
      {consumeVis && (
        <CheckConsumeRecord
          visible={consumeVis}
          data={data}
          type="student"
          onCancel={() => setConsumeVis(false)}
        />
      )}

      {/* 查看剩余课销 */}
      {surplusVis && (
        <Surplus visible={surplusVis} data={data} onCancel={() => setSurplusVis(false)} />
      )}
    </div>
  );
};

export default StudentList;
