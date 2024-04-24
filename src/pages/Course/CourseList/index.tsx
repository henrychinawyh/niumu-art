/* eslint-disable @typescript-eslint/no-use-before-define */
import { useCountDownConfirm } from '@/pages/hooks/useConfirmHook';
import { ActionType, PageContainer, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button, Space, Table, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateOrEdit from './components/createOrEdit';
import { useInitColumns } from './field';
import { TableListItemProps } from './interface';
import { deleteCourse, deleteGrade, getCourseGrade, getCourseList } from './services';

const CourseList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [confirm, modalContent] = useCountDownConfirm(5);

  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<Partial<TableListItemProps> | null>(null);
  const [type, setType] = useState<'create' | 'edit'>('create');
  const [expandData, setExpandData] = useState<any>({});

  const columns = useInitColumns(
    (data: TableListItemProps) => {
      setVisible(true);
      setType('edit');
      setData(data);
    },
    (id: string) => {
      delCourse(id);
    },
  );

  // 删除课程
  const delCourse = async (id: string | string[]) => {
    const res = await deleteCourse({
      id,
    });
    if (res.code === '000') {
      message.success('删除成功');
      tableRef.current?.reload();
    }
  };

  // 展开课程行获取课程的所有级别
  const getGrade = async (r: TableListItemProps) => {
    const res = await getCourseGrade({ courseId: r.id });

    if (res.code === '000') {
      setExpandData((prev: any) => ({
        ...prev,
        [r.id]: {
          list: res?.data?.list,
          total: res?.data?.total,
        },
      }));
    }
  };

  // 编辑级别名称
  const editGrade = async (id: number, name: string) => {};

  // 删除级别
  const delGrade = async (gradeId: number, courseRecord: TableListItemProps) => {
    confirm({
      title: '删除级别',
      content: '删除级别会将级别下所有的班级以及班级学员一并删除',
      onOk: async () => {
        const res = await deleteGrade({ id: gradeId });
        if (res.code === '000') {
          getGrade(courseRecord);
        }
      },
    });
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
          setExpandData({});
          const res = await getCourseList(params);

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
              setData(null);
            }}
          >
            新增课程
          </Button>,
        ]}
        options={false}
        tableAlertRender={false}
        expandable={{
          expandedRowRender: (record: TableListItemProps) => {
            return (
              <Table
                rowKey={'id'}
                size="small"
                pagination={{
                  total: expandData?.[record?.id]?.total || 0,
                }}
                dataSource={expandData?.[record?.id]?.list ? expandData[record?.id].list : []}
                columns={[
                  {
                    title: '级别名称',
                    dataIndex: 'name',
                  },
                  {
                    title: '操作',
                    dataIndex: 'opt',
                    render: (t: string, r: TableListItemProps) => {
                      return (
                        <Space>
                          <Button type="link">编辑</Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => {
                              delGrade(r.id, record);
                            }}
                          >
                            删除
                          </Button>
                        </Space>
                      );
                    },
                  },
                ]}
              />
            );
          },
          onExpand: (expandable, record) => {
            if (expandable && !expandData?.[record.id]) {
              getGrade(record);
            }
          },
        }}
      />

      {visible && (
        <CreateOrEdit
          title={type === 'create' ? '新增课程' : '编辑课程'}
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

      {modalContent}
    </PageContainer>
  );
};

export default CourseList;
