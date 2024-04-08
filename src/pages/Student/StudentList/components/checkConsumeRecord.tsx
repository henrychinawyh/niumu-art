/**
 * @name 查看学员消费记录
 */

import FormatDate from '@/components/Date/FormatDate';
import { getTotalWidth } from '@/utils';
import { Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { queryFamilyConsumeRecord, queryStudentConsumeRecord } from '../services';

type Type = 'student' | 'family';

interface IProps {
  data: Partial<any> | null;
  type: Type;
  visible: boolean;
  onCancel: () => void;
  [keys: string]: any;
}

const CheckConsumeRecord: React.FC<IProps> = (props) => {
  const { data, type, onCancel, visible } = props || {};
  const { id, familyId, stuName, familyName } = data || {};

  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPagesize] = useState(10);
  const [loading, setLoading] = useState(false);

  const columns: any[] = [
    type === 'family' && {
      title: '学员名称',
      dataIndex: 'stuName',
      width: 100,
    },
    {
      title: '原单价',
      dataIndex: 'originPrice',
      width: 100,
    },
    {
      title: '消费数量',
      dataIndex: 'consumeNum',
      width: 100,
    },
    {
      title: '消费折扣',
      dataIndex: 'discount',
      width: 120,
      render: (t: string) => (t && +t < 1 && +t > 0 ? `${+t * 10}折(${t})` : '无折扣'),
    },
    {
      title: '消费总金额',
      dataIndex: 'cost',
      width: 120,
    },
    {
      title: '消费详情',
      dataIndex: 'consumeDetail',
      width: 300,
    },
    {
      title: '消费时间',
      dataIndex: 'createTime',
      width: 120,
      render: (t: any) => <FormatDate time={t} />,
    },
  ].filter((item) => !!item);

  useEffect(() => {
    getConsumeRecord({ id, familyId }, type);
  }, [type, id, familyId, current, pageSize]);

  // 获取消费记录
  const getConsumeRecord = async (data: any, type: Type) => {
    const { id, familyId } = data;

    if ((id || familyId) && type) {
      let res;
      setLoading(true);
      if (type === 'family') {
        res = await queryFamilyConsumeRecord({ familyId, current, pageSize });
      } else {
        res = await queryStudentConsumeRecord({ studentId: id, current, pageSize });
      }
      setLoading(false);

      if (res.code === '000') {
        setDataSource(res?.data?.list || []);
        setTotal(res?.data?.total || 0);
      }
    }
  };

  return (
    <Modal
      open={visible}
      title={`查看（${type === 'student' ? stuName : familyName}）消费记录`}
      destroyOnClose
      maskClosable={false}
      width={900}
      onCancel={onCancel}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
      onOk={() => onCancel()}
    >
      <Table
        rowKey={'id'}
        dataSource={dataSource}
        columns={columns}
        pagination={{ total, current, pageSize }}
        onChange={({ current, pageSize }) => {
          setCurrent(current as number);
          setPagesize(pageSize as number);
        }}
        loading={loading}
        scroll={{
          x: getTotalWidth(columns),
        }}
      />
    </Modal>
  );
};

export default CheckConsumeRecord;
