/**
 * @name 查看班级详情
 */

import QueryStudentModal from '@/components/QueryStudentModal';
import { useCountDownConfirm } from '@/hooks/useConfirmHook';
import { queryTeacherWithCourse } from '@/pages/Teacher/TeacherList/services';
import { getTotalWidth, getYearDiff } from '@/utils';
import { GENDER, YES_OR_NO } from '@/utils/constant';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, Tooltip, message } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { intersection } from 'lodash';
import React, { useEffect, useState } from 'react';
import { StudentProps, TableListItemProps } from '../interface';
import {
  addStudentToClass,
  deleteStudentOfClass,
  editClass,
  getClassDetail,
  hasRemianCourseCount,
} from '../services';
import AddClassCourse from './addClassCourse';
import SwitchClass from './switchClass';

interface IProps {
  visible: boolean;
  data: Partial<TableListItemProps> | null;
  onCancel: (status?: boolean) => void;
}

const Detail: React.FC<IProps> = (props) => {
  const [form] = Form.useForm();
  const { data, visible, onCancel } = props;
  const [dataSource, setDataSource] = React.useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
  const [teachers, setTeachers] = useState([]);

  // 添加学员
  const [addStuVis, setAddStuVis] = React.useState<boolean>(false);

  // 添加课时
  const [addVisible, setAddVisible] = React.useState<boolean>(false);

  // 转班
  const [switchVisible, setSwitchVisible] = React.useState<boolean>(false);
  const [switchData, setSwitchData] = React.useState({});
  const [loading, setLoading] = useState(false);

  const [confirm, modalContent] = useCountDownConfirm(5);

  useEffect(() => {
    if (data?.classId) {
      getDetail();
      getTeacher();
    }
  }, [data?.classId]);

  const columns: any[] = [
    {
      title: '学员名称',
      dataIndex: 'stuName',
      width: 90,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (t: keyof typeof GENDER) => GENDER[t] || '',
      width: 60,
    },
    {
      title: '年龄',
      dataIndex: 'birthDate',
      render: (t: string) => (t ? getYearDiff(t, new Date()) : ''),
      width: 60,
    },
    {
      title: '剩余课时(节)',
      dataIndex: 'remainCourseCount',
      render: (t: number) => t ?? '-',
      width: 110,
    },
    {
      title: '剩余课销(￥)',
      dataIndex: 'remainCost',
      render: (t: number) => t ?? '-',
      width: 110,
    },
    {
      title: '课销费用(￥)',
      dataIndex: 'payment',
      render: (t: number) => t ?? '-',
      width: 110,
    },
    {
      title: '账户余额(￥)',
      dataIndex: 'accountBalance',
      width: 110,
    },
    {
      title: '是否会员',
      dataIndex: 'isMember',
      render: (t: keyof typeof YES_OR_NO) => YES_OR_NO[t || 0],
      width: 80,
    },
    {
      title: '会员折扣',
      dataIndex: 'discount',
      render: (t: number) => (t < 1 ? `${t * 10}折(${t})` : '无折扣'),
      width: 90,
    },
    {
      title: '操作',
      dataIndex: 'opt',
      width: 100,
      fixed: 'right',
      render: (_: any, record: StudentProps & Pick<TableListItemProps, 'classId'>) => (
        <Space>
          <a
            onClick={() => {
              setSwitchVisible(true);
              setSwitchData({
                ...record,
                courseId: data?.courseId,
                courseSemester: data?.courseSemester,
                gradeId: data?.gradeId,
              });
            }}
          >
            转班
          </a>
          <a
            onClick={async () => {
              const count = await hasRemianCourseCount({
                id: record?.payId,
              });
              if (count?.data?.length > 0 && count?.data[0].remianCourseCount > 0) {
                confirm({
                  title: '删除提示',
                  content: (
                    <div>
                      学员 {record?.name}当前剩余
                      <span
                        style={{
                          color: '#ff4d4f',
                          fontWeight: 600,
                          padding: '0 2px',
                        }}
                      >
                        {count?.data[0].remianCourseCount}
                      </span>
                      节课，是否确认删除？删除后课程数据无法恢复
                    </div>
                  ),
                  okText: '确认删除',
                  cancelText: '再想想',
                  onOk: () => {
                    handleDelete(record?.id);
                  },
                });
              } else {
                handleDelete(record?.id);
              }
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  // 获取班级详情
  const getDetail = async () => {
    setLoading(true);

    try {
      const res = await getClassDetail({
        id: data?.classId,
      });
      if (res?.code === '000') {
        const { data } = res || {};
        setDataSource(data?.list);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // 获取课程类目任课教师
  const getTeacher = async () => {
    const res = await queryTeacherWithCourse({ courseId: data?.courseId });

    if (res?.code === '000') {
      setTeachers(res?.data || []);
    }
  };

  // 删除学员
  const handleDelete = async (id: number) => {
    const res = await deleteStudentOfClass({
      id,
    });

    if (res) {
      message.success('删除成功');
      setDataSource((prev) => prev.filter((item) => item?.id !== id));
    }
  };

  // 添加学员
  const addStudent = async (studentIds: number[]) => {
    const tempArr = intersection(
      dataSource?.map((item) => item.studentId),
      studentIds,
    );

    if (tempArr?.length > 0) {
      dataSource?.forEach((item) => {
        if (tempArr?.includes(item.studentId)) {
          message.warning(`${item?.stuName}已存在，请勿重复添加`);
        }
      });

      return;
    }

    const res = await addStudentToClass({
      studentIds,
      courseId: data?.courseId,
      gradeId: data?.gradeId,
      classId: data?.classId,
    });

    if (res?.data) {
      message.success('添加成功');
      getDetail();
      setAddStuVis(false);
    }
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], rows: TableListItemProps[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(rows);
    },
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={`查看详情`}
      open={visible}
      width={1100}
      onCancel={() => {
        onCancel?.();
      }}
      onOk={async () => {
        // 保存编辑的班级信息
        const values = await form.validateFields();
        await editClass({
          ...values,
          classId: data?.classId,
        });

        onCancel?.(true);
      }}
    >
      <Row gutter={10}>
        <Col span={8}>
          <Form
            form={form}
            initialValues={{
              name: data?.className,
              teacherId: data?.teacherId,
            }}
          >
            <Form.Item
              label="班级名称"
              name="name"
              rules={[{ required: true, message: '请输入班级名称' }]}
            >
              <Input placeholder="请输入班级名称" allowClear />
            </Form.Item>
            <Form.Item
              label="任课教师"
              name="teacherId"
              rules={[{ required: true, message: '请选择任课教师' }]}
            >
              <Select options={teachers} placeholder="请选择教师" allowClear />
            </Form.Item>
          </Form>
        </Col>
      </Row>

      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
      >
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Tooltip
            title={
              selectedRowKeys.length === 0
                ? '请选择学员添加课时'
                : selectedRows?.some((item) => item?.remainCourseCount > 0)
                ? '选中的学员须销完自身剩余课时才能添加新课时'
                : false
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              disabled={
                selectedRowKeys.length === 0 ||
                selectedRows?.some((item) => item?.remainCourseCount > 0)
              }
              onClick={() => {
                if (selectedRows.some((item) => Number(item?.accountBalance) === 0)) {
                  message.warning('当前已选中学员中账户余额为0的不能添加课时');
                  return;
                }

                setAddVisible(true);
              }}
            >
              批量添加课时
            </Button>
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              marginLeft: 10,
            }}
            onClick={() => {
              setAddStuVis(true);
            }}
          >
            批量添加学员
          </Button>
        </div>
        <Table
          rowKey={'id'}
          dataSource={dataSource}
          columns={columns}
          rowSelection={rowSelection}
          loading={loading}
          scroll={{
            x: getTotalWidth(columns),
          }}
        />
      </Space>

      {/* 添加课时弹框 */}
      {addVisible && (
        <AddClassCourse
          data={data}
          visible={addVisible}
          students={selectedRows}
          onCancel={(refresh) => {
            setAddVisible(false);
            setSelectedRows([]);
            setSelectedRowKeys([]);

            if (refresh) {
              getDetail();
            }
          }}
        />
      )}

      {/* 确认是否要删除学员弹框 */}
      {modalContent}

      {/* 转班 */}
      {switchVisible && (
        <SwitchClass
          onCancel={(refresh) => {
            setSwitchVisible(false);
            if (refresh) {
              onCancel?.(refresh);
            }
          }}
          onOk={(refresh) => {
            setSwitchVisible(false);
            onCancel?.(refresh);
          }}
          data={switchData}
          visible={switchVisible}
        />
      )}

      {/* 批量添加学员 */}
      {addStuVis && (
        <QueryStudentModal
          debounceTime={500}
          mode="multiple"
          destroyOnClose
          open={addStuVis}
          onCancel={() => setAddStuVis(false)}
          onOk={addStudent}
          width={300}
        />
      )}
    </Modal>
  );
};

export default Detail;
