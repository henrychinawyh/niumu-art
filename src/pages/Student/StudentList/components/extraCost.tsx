/**
 * @name 批量课外消费
 */

import { YES_OR_NO } from '@/utils/constant';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { floor } from 'lodash';
import { useEffect, useState } from 'react';
import { TableListItemProps } from '../interface';
import { addExtraConsume } from '../services';

interface IProps {
  onCancel: (refresh?: boolean) => void;
  visible: boolean;
  datas?: TableListItemProps[];
}

const ExtraCost: React.FC<IProps> = (props) => {
  const { onCancel, visible, datas = [] } = props ?? {};

  const [dataSource, setDataSource] = useState<TableListItemProps[]>([]);
  const columns: ColumnsType<Partial<TableListItemProps>> = [
    {
      title: '学员名称',
      dataIndex: 'stuName',
    },
    {
      title: '是否会员',
      dataIndex: 'isMember',
      render: (t: keyof typeof YES_OR_NO) => YES_OR_NO[t || 0],
    },
    {
      title: '享受折扣',
      dataIndex: 'discount',
      render: (t) => (t ? `${+t * 10}折` : '无折扣'),
    },
    {
      title: '应收金额',
      dataIndex: 'originPrice',
      render: (t) => (t ? floor(t, 2).toFixed(2) : '0.00'),
    },
    {
      title: '实收金额',
      dataIndex: 'actualPrice',
      render: (t) => (t ? floor(t, 2).toFixed(2) : '0.00'),
    },
  ];

  // 消费金额
  const [money, setMoney] = useState(0);
  // 消费数量
  const [count, setCount] = useState(0);

  // 初始化dataSource
  useEffect(() => {
    if (Array.isArray(datas) && datas.length) {
      setDataSource(datas);
    }
  }, datas);

  // 当消费金额和消费数量发生变化的时候
  useEffect(() => {
    setDataSource((prev) =>
      prev.map((item) => ({
        ...item,
        originPrice: money,
        actualPrice: floor(money * count * (item.isMember ? +item.discount : 1), 2),
      })),
    );
  }, [money, count]);

  return (
    <ModalForm
      title={'批量新增课外消费'}
      modalProps={{
        onCancel: () => {
          onCancel();
        },
        destroyOnClose: true,
        maskClosable: false,
        width: 500,
      }}
      open={visible}
      autoFocusFirstInput
      layout="horizontal"
      grid
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      rowProps={{
        gutter: 10,
      }}
      onFinish={async (values) => {
        const { consumeDetail } = values || {};
        let params = {
          consumeDetail,
          studentInfos: dataSource.map((item) => ({
            studentId: item.id,
            discount: item.discount,
            familyId: item.familyId,
            isMember: item.isMember,
            originPrice: item.originPrice,
            actualPrice: item.actualPrice,
            stuName: item.stuName,
            consumeNum: count,
          })),
        };

        const res = await addExtraConsume(params);

        if (res.data) {
          message.success(res?.message);
          onCancel?.(true);
        }
      }}
      initialValues={{
        studentIds: datas?.map((item) => item.id),
      }}
    >
      <ProFormSelect
        label="选择学员"
        name="studentIds"
        options={datas?.map((item) => ({
          label: item.stuName,
          value: item.id,
        }))}
        fieldProps={{
          disabled: true,
          mode: 'multiple',
          maxTagCount: 6,
          onChange: (val: number[]) => {
            const tempArr = datas?.filter((item) => val.includes(item.id));
            setDataSource((prev) =>
              tempArr.reduce((pre: TableListItemProps[], next) => {
                let index = prev.findIndex((item) => item.id === next.id);

                if (index > -1) {
                  return pre.concat(prev[index]);
                } else {
                  return pre.concat({
                    ...next,
                    originPrice: money,
                    actualPrice:
                      money && count ? money * count * (next.isMember ? +next.discount : 1) : money,
                  });
                }
              }, []),
            );
          },
        }}
        colProps={{ span: 24 }}
        rules={[
          {
            required: true,
            message: '请选择学员',
          },
        ]}
      />

      <ProFormTextArea
        label="消费详情"
        name="consumeDetail"
        colProps={{ span: 24 }}
        fieldProps={{
          maxLength: 100,
          showCount: true,
        }}
        rules={[
          {
            required: true,
            message: '请填写消费详情',
          },
        ]}
      />

      <ProFormDigit
        label="消费单价"
        name="originPrice"
        colProps={{ span: 24 }}
        rules={[
          {
            required: true,
            message: '请填写消费金额',
          },
        ]}
        fieldProps={{
          onChange: (val) => {
            setMoney(val || 0);
          },
          precision: 2,
        }}
      />

      <ProFormDigit
        label="消费数量"
        name="consumeNum"
        colProps={{ span: 24 }}
        rules={[
          {
            required: true,
            message: '请填写消费数量',
          },
          {
            pattern: /^[1-9]\d*$/,
            message: '请填写正整数',
          },
        ]}
        fieldProps={{
          onChange: (val) => {
            setCount(val || 0);
          },
        }}
      />

      <Table
        rowKey={'id'}
        style={{
          width: '100%',
        }}
        columns={columns}
        dataSource={dataSource}
      />
    </ModalForm>
  );
};

export default ExtraCost;
