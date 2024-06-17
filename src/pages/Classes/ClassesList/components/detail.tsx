/**
 * @name 查看班级详情
 */

import { useCountDownConfirm } from '@/hooks/useConfirmHook';
import { getTotalWidth, getYearDiff } from '@/utils';
import { GENDER, YES_OR_NO } from '@/utils/constant';
import { getDateString } from '@/utils/date';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Table, Tooltip, message } from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect } from 'react';
import { StudentProps, TableListItemProps } from '../interface';
import { deleteStudentOfClass, hasRemianCourseCount } from '../services';
import AddClassCourse from './addClassCourse';
import SwitchClass from './switchClass';

interface IProps {
  visible: boolean;
  data: Partial<TableListItemProps> | null;
  onCancel: (status?: boolean) => void;
}

const Detail: React.FC<IProps> = (props) => {
  const { data, visible, onCancel } = props;
  const [dataSource, setDataSource] = React.useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);

  // 添加课时
  const [addVisible, setAddVisible] = React.useState<boolean>(false);

  // 转班
  const [switchVisible, setSwitchVisible] = React.useState<boolean>(false);
  const [switchData, setSwitchData] = React.useState({});

  const [confirm, modalContent] = useCountDownConfirm(5);

  const columns: any[] = [
    {
      title: '学员名称',
      dataIndex: 'name',
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
                    handleDelete(record?.studentId);
                  },
                });
              } else {
                handleDelete(record?.studentId);
              }
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (data) {
      setDataSource(data?.studentList || []);
    }
  }, [data]);

  // 删除学员
  const handleDelete = async (studentId: number) => {
    const res = await deleteStudentOfClass({
      classId: data?.classId,
      studentId,
    });

    if (res) {
      message.success('删除成功');
      setDataSource((prev) => prev.filter((item) => item?.studentId !== studentId));
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
      title={`${data?.className}`}
      open={visible}
      width={1000}
      cancelButtonProps={{
        style: { display: 'none' },
      }}
      onCancel={() => {
        onCancel?.(true);
      }}
      onOk={async () => {
        onCancel?.(true);
      }}
    >
      <Descriptions column={1}>
        <DescriptionsItem label="任课教师">{data?.teacherName}</DescriptionsItem>
        <DescriptionsItem label="班级创建时间">{getDateString(data?.createTs)}</DescriptionsItem>
        <DescriptionsItem label="班级学员人数">{`${dataSource?.length}人`}</DescriptionsItem>
      </Descriptions>

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
              selectedRowKeys.length === 0 ||
              selectedRows?.some((item) => item?.remainCourseCount > 0)
                ? '请选择剩余课时为0的学员添加课时'
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
                setAddVisible(true);
              }}
            >
              批量添加课时
            </Button>
          </Tooltip>
        </div>
        <Table
          rowKey={'id'}
          dataSource={dataSource}
          columns={columns}
          rowSelection={rowSelection}
          scroll={{
            x: getTotalWidth(columns),
          }}
        />
      </Space>

      {/* 添加课时弹框 */}
      <AddClassCourse
        data={data}
        visible={addVisible}
        students={selectedRows}
        onCancel={(refresh) => {
          setAddVisible(false);
          setSelectedRows([]);
          setSelectedRowKeys([]);

          if (refresh) {
            onCancel?.(refresh);
          }
        }}
      />

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
          onOk={(data) => {
            setSwitchVisible(false);
            onCancel?.(data);
          }}
          data={switchData}
          visible={switchVisible}
        />
      )}
    </Modal>
  );
};

export default Detail;
