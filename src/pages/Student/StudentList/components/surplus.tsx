/**
 * @name 查看学员的剩余课销
 */

import { TERM } from '@/utils/constant';
import { Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { TableListItemProps } from '../interface';
import { querySurplus } from '../services';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  data: Partial<TableListItemProps> | null;
}

const Surplus: React.FC<IProps> = (props) => {
  const { visible, onCancel, data } = props;

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<any> = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      width: 100,
    },
    {
      title: '课程学期',
      dataIndex: 'courseSemester',
      width: 100,
      render: (t: keyof typeof TERM) => TERM[t],
    },
    {
      title: '课程级别',
      dataIndex: 'gradeName',
      width: 100,
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      width: 100,
    },
    {
      title: '剩余课销金额',
      dataIndex: 'remainCost',
      width: 120,
    },
    {
      title: '剩余课销课时',
      dataIndex: 'remainCourseCount',
      width: 120,
    },
  ];

  useEffect(() => {
    if (data?.id) {
      getSurplus(data.id);
    }
  }, [data]);

  // 获取剩余课销数据
  const getSurplus = async (id: number) => {
    setLoading(true);
    const res = await querySurplus({ id });
    setLoading(false);

    if (res?.code === '000') {
      setDataSource(res.data);
    }
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      width={800}
      title="剩余课销"
      open={visible}
      onCancel={onCancel}
      onOk={onCancel}
    >
      <Table columns={columns} dataSource={dataSource} loading={loading} />
    </Modal>
  );
};

export default Surplus;
