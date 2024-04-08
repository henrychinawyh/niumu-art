/**
 * @names 班级管理
 */

import useGetAllSubjects from '@/hooks/useGetAllSubjects';
import { getTotalWidth } from '@/utils';
import { ActionType, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef } from 'react';
import CreateOrEdit from './components/createOrEdit';
import Detail from './components/detail';
import { useInitColumns } from './fields';
import { TableListItemProps } from './interface';
import { queryClass } from './services';

const ClassesList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [visible, setVisible] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Partial<TableListItemProps> | null>(null);
  const [detailVis, setDetailVis] = React.useState(false);

  const subjects = useGetAllSubjects(4);

  const columns = useInitColumns(
    subjects,
    (data: TableListItemProps) => {
      setDetailVis(true);
      setData(data);
    },
    () => {
      tableRef.current?.reload();
    },
    formRef,
  );

  return (
    <div>
      <ProTable<TableListItemProps>
        actionRef={tableRef}
        formRef={formRef}
        rowKey="classId"
        request={async (options) => {
          const { subject, teacherName, courseSemester } = options;
          const params: any = {
            teacherName,
            current: options.current,
            pageSize: options.pageSize,
            courseSemester,
          };

          if (Array.isArray(subject)) {
            params.courseId = subject[0];
            params.gradeId = subject[1];
            params.courseSemester = subject[2];
            params.classId = subject[3];
          }

          const res = await queryClass(params);

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

      {/* 查看班级详情 */}
      {detailVis && (
        <Detail
          onCancel={(refresh?: boolean) => {
            if (refresh) {
              tableRef.current?.reload();
            }
            setData(null);
            setDetailVis(false);
          }}
          visible={detailVis}
          data={data}
        />
      )}

      {/* 创建，编辑班级 */}
      {visible && (
        <CreateOrEdit
          title={'新增班级'}
          onCancel={(refresh?: boolean) => {
            if (refresh) {
              tableRef.current?.reload();
            }
            setData(null);
            setVisible(false);
          }}
          visible={visible}
          data={data}
        />
      )}
    </div>
  );
};

export default ClassesList;
