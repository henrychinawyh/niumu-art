/**
 * @name 查看班级详情
 */

import { useCountDownConfirm } from '@/hooks/useConfirmHook';
import { getYearDiff } from '@/utils';
import { GENDER } from '@/utils/constant';
import { getDateString } from '@/utils/date';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Table, Tooltip, message } from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect } from 'react';
import { StudentProps, TableListItemProps } from '../interface';
import { deleteStudentOfClass, hasRemianCourseCount } from '../services';
import AddClassCourse from './addClassCourse';

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
  const [addVisible, setAddVisible] = React.useState<boolean>(false);

  const [confirm, modalContent] = useCountDownConfirm(5);

  const columns = [
    {
      title: '学员名称',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (t: keyof typeof GENDER) => GENDER[t] || '',
    },
    {
      title: '年龄',
      dataIndex: 'birthDate',
      render: (t: string) => (t ? getYearDiff(t, new Date()) : ''),
    },
    {
      title: '剩余课时(节)',
      dataIndex: 'remainCourseCount',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      render: (_: any, record: StudentProps & Pick<TableListItemProps, 'classId'>) => (
        <Space>
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
    onChange: (selectedRowKeys: React.Key[], rows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(
        rows?.map((item) => ({
          id: item.id,
          studentId: item.studentId,
          remainCourseCount: item.remainCourseCount,
          payId: item.payId,
        })),
      );
    },
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={`${data?.className}`}
      open={visible}
      width={700}
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
        />
      </Space>

      {/* 添加课时弹框 */}
      <AddClassCourse
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
    </Modal>
  );
};

export default Detail;
