import { TERM } from '@/utils/constant';
import { DeleteOutlined } from '@ant-design/icons';
import { ActionType, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button, Card, Popconfirm, Space, Table, message } from 'antd';
import React, { useRef, useState } from 'react';
import AddGrade from './components/addGrade';
import CreateOrEdit from './components/createOrEdit';
import type { CourseGradeProps } from './components/editGradeName';
import EditGradeName from './components/editGradeName';
import { useInitColumns } from './field';
import styles from './index.less';
import { GradeItemProps, TableListItemProps } from './interface';
import {
  addCourseGrade,
  deleteCourse,
  deleteGrade,
  getCourseGrade,
  getCourseList,
} from './services';

const CourseList: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  // const [confirm, modalContent] = useCountDownConfirm(5);

  const [visible, setVisible] = useState<boolean>(false); // 新增课程弹框
  const [data, setData] = useState<Partial<TableListItemProps> | null>(null); // 编辑课程信息
  const [type, setType] = useState<'create' | 'edit'>('create'); // 操作课程类型

  const [expandData, setExpandData] = useState<any>({}); // 展开课程下的级别信息
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]); // 控制展开行
  const [gradeVisible, setGradeVisible] = useState<boolean>(false); // 编辑课程级别名称弹框
  const [gradeInfo, setGradeInfo] = useState<CourseGradeProps | null>(null);

  // 为课程新增级别
  const [gradeVis, setGradeVis] = useState(false);
  const [courseId, setCourseId] = useState<number>();

  const columns = useInitColumns(
    (data: TableListItemProps) => {
      setVisible(true);
      setType('edit');
      setData(data);
    },
    (id: number) => {
      delCourse(id);
    },
    (id: number) => {
      setCourseId(id);
      setGradeVis(true);
    },
  );

  // 删除课程
  const delCourse = async (id: number) => {
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

  // 为课程新增级别
  const addGrade = async (values: any) => {
    const { grades } = values || {};

    if (
      Array.from(new Set(grades.map((item: any) => `${item.courseSemester}-${item.name}`)))
        ?.length < grades.length
    ) {
      message.error('学期和级别名称不能重复');
      return;
    }

    const params: any = {
      courseId,
      grades,
    };

    const res = await addCourseGrade(params);

    if (res?.code === '000') {
      message.success(res?.message);
      setGradeVis(false);

      // 请求课程级别
      getGrade({
        id: courseId,
      });
    }
  };

  // 编辑级别名称
  // const editGrade = async (data: CourseGradeProps) => {
  //   setGradeInfo(data);
  //   setGradeVisible(true);
  // };

  // 删除级别
  const delGrade = async (params: any) => {
    const { courseId, gradeId } = params;

    const res = await deleteGrade({
      id: gradeId,
    });
    message.success(res?.message || '删除成功');
    if (res?.data) {
      setExpandData((prev: any) => {
        prev[courseId].list = prev[courseId].list.filter((item: any) => item.value !== gradeId);
        prev[courseId].total -= 1;

        return JSON.parse(JSON.stringify(prev));
      });
    }
  };

  return (
    <div>
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
            let category = new Array(3);
            expandData?.[record?.id]?.list?.forEach((item: any) => {
              const { courseSemester } = item || {};

              if (Array.isArray(category[courseSemester - 1])) {
                category[courseSemester - 1].push(item);
              } else {
                category[courseSemester - 1] = [item];
              }
            });

            return (
              <Space
                style={{
                  width: '100%',
                  padding: 12,
                }}
                direction="vertical"
                size={15}
                className={styles.expandTable}
              >
                {category?.map((item) => (
                  <Card
                    title={TERM[item?.[0]?.courseSemester as keyof typeof TERM]}
                    key={item?.[0]?.courseSemester}
                    bordered={false}
                  >
                    <Table
                      rowKey={'value'}
                      size="small"
                      // pagination={{
                      //   total: expandData?.[record?.id]?.total || 0,
                      // }}
                      dataSource={item || []}
                      columns={[
                        // {
                        //   title: '级别学期',
                        //   dataIndex: 'courseSemester',
                        //   render: (t: keyof typeof TERM) => (t ? TERM[t] : '-'),
                        // },
                        {
                          title: '级别名称',
                          dataIndex: 'label',
                        },
                        {
                          title: '级别学员人数',
                          dataIndex: 'gradeStuTotal',
                          render: (t) => t || '-',
                        },
                        {
                          title: '级别课时',
                          dataIndex: 'courseCount',
                          render: (t) => `${t || '-'}课时`,
                        },
                        {
                          title: '级别价格(元)',
                          dataIndex: 'courseOriginPrice',
                        },
                        {
                          title: '课程单价(元/节)',
                          dataIndex: 'eachCoursePrice',
                          render: (t) => t || '-',
                        },
                        {
                          title: '操作',
                          dataIndex: 'opt',
                          render: (t: string, r: GradeItemProps) => {
                            return (
                              <Space>
                                {/* <Button
                                  type="link"
                                  icon={<EditOutlined />}
                                  onClick={() => {
                                    editGrade({
                                      id: r.value,
                                      name: r.label,
                                      courseId: record.id,
                                      courseSemester: r.courseSemester,
                                      courseCount: r.courseCount,
                                      courseOriginPrice: Number(r.courseOriginPrice),
                                    });
                                  }}
                                >
                                  编辑
                                </Button> */}
                                {r.gradeStuTotal <= 0 && (
                                  <Popconfirm
                                    title="确认删除级别"
                                    onConfirm={() =>
                                      delGrade({
                                        gradeId: r.value,
                                        courseId: record.id,
                                      })
                                    }
                                  >
                                    <Button type="link" icon={<DeleteOutlined />} danger>
                                      删除
                                    </Button>
                                  </Popconfirm>
                                )}
                              </Space>
                            );
                          },
                        },
                      ]}
                    />
                  </Card>
                ))}
              </Space>
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

      {/* 新增课程级别 */}
      {gradeVis && (
        <AddGrade
          visible={gradeVis}
          title="新增课程"
          onFinish={addGrade}
          onCancel={() => {
            setGradeVis(false);
          }}
        />
      )}
    </div>
  );
};

export default CourseList;
