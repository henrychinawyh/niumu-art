/**
 * @name 查看班级详情
 */

import { useCountDownConfirm } from '@/hooks/useConfirmHook';
import { getYearDiff } from '@/utils';
import { GENDER } from '@/utils/constant';
import { getDateString } from '@/utils/date';
import { Descriptions, Modal, Table, message } from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import React, { useEffect } from 'react';
import { StudentProps, TableListItemProps } from '../interface';
import { deleteStudentOfClass, hasRemianCourseCount } from '../services';

interface IProps {
  visible: boolean;
  data: Partial<TableListItemProps> | null;
  onCancel: (status?: boolean) => void;
}

const Detail: React.FC<IProps> = (props) => {
  const { data, visible, onCancel } = props;
  const [dataSource, setDataSource] = React.useState<any[]>([]);
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
        <a
          onClick={async () => {
            const count = await hasRemianCourseCount({
              classId: data?.classId,
              studentId: record?.id,
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
      setDataSource((prev) => prev.filter((item) => item?.id !== studentId));
    }
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
      <Table rowKey={'id'} dataSource={dataSource} columns={columns} />

      {/* 确认是否要删除学员弹框 */}
      {modalContent}
    </Modal>
  );
};

export default Detail;
