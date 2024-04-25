/* eslint-disable @typescript-eslint/no-use-before-define */
import { useCountDownConfirm } from '@/hooks/useConfirmHook';
import { ActionType, PageContainer, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button, Space, Table, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateOrEdit from './components/createOrEdit';
import type { CourseGradeProps } from './components/editGradeName';
import EditGradeName from './components/editGradeName';
import { useInitColumns } from './field';
import { TableListItemProps } from './interface';
import { deleteCourse, deleteGrade, getCourseGrade, getCourseList } from './services';

const CourseList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [confirm, modalContent] = useCountDownConfirm(5);

  const [visible, setVisible] = useState<boolean>(false); // 新增课程弹框
  const [data, setData] = useState<Partial<TableListItemProps> | null>(null); // 编辑课程信息
  const [type, setType] = useState<'create' | 'edit'>('create'); // 操作课程类型

  const [expandData, setExpandData] = useState<any>({}); // 展开课程下的级别信息
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]); // 控制展开行
  const [gradeVisible, setGradeVisible] = useState<boolean>(false); // 编辑课程级别名称弹框
  const [gradeInfo, setGradeInfo] = useState<CourseGradeProps | null>(null);

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
  const getGrade = async (r: Partial<TableListItemProps>) => {
    const res = await getCourseGrade({ courseId: r.id });

    if (res.code === '000') {
      setExpandData((prev: any) => ({
        ...prev,
        [r.id as any]: {
          list: res?.data?.list,
          total: res?.data?.total,
        },
      }));
    }
  };

  // 编辑级别名称
  const editGrade = async (data: CourseGradeProps) => {
    setGradeInfo(data);
    setGradeVisible(true);
  };

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
          setExpandedRowKeys([]);
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
          expandedRowKeys,
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
                          <Button
                            type="link"
                            onClick={() => {
                              editGrade({
                                id: r.id,
                                name: r.name,
                                courseId: record.id,
                              });
                            }}
                          >
                            编辑
                          </Button>
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
            if (!expandable) {
              setExpandedRowKeys((prev) => prev.filter((item) => item !== record.id));
            }

            if (expandable) {
              if (!expandData?.[record.id]) {
                getGrade(record);
              }
              setExpandedRowKeys((prev) => prev.concat(record.id));
            }
          },
        }}
      />

      {/* 新增编辑课程 */}
      {visible && (
        <CreateOrEdit
          title={type === 'create' ? '新增课程' : '编辑课程'}
          onCancel={(refresh?: boolean) => {
            if (refresh) {
              setExpandedRowKeys([]); // 将所有展开行收起
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

      {/* 编辑课程级别名称 */}
      {gradeInfo && gradeVisible && (
        <EditGradeName
          visible={gradeVisible}
          onCancel={(status) => {
            if (status) {
              // 重新查询当前课程下的所有级别
              getGrade({
                id: gradeInfo?.courseId,
              });
            }

            setGradeInfo(null);
            setGradeVisible(false);
          }}
          info={gradeInfo}
        />
      )}

      {modalContent}
    </PageContainer>
  );
};

export default CourseList;
