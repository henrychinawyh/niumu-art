/**
 * @name 充值弹框
 */

import { ModalForm, ProFormDigit, ProFormMoney } from '@ant-design/pro-components';
import { Form, Space, message } from 'antd';
import { floor } from 'lodash';
import { useState } from 'react';
import { recharge, registerMember } from '../../services';
import { ChargeType, TableListItemProps } from '../interface';

interface IProps {
  type: ChargeType | undefined;
  data: Partial<TableListItemProps>;
  visible: boolean;
  onCancel: (status?: boolean) => void;
}

const Charge: React.FC<IProps> = (props) => {
  const { type, data, visible, onCancel } = props || {};

  const [form] = Form.useForm<any>();
  const [rechargeMoney, setRechargeMoney] = useState<number>(0);

  return (
    <ModalForm
      form={form}
      modalProps={{
        onCancel: () => {
          setRechargeMoney(0);
          onCancel();
        },
        destroyOnClose: true,
        maskClosable: false,
      }}
      open={visible}
      autoFocusFirstInput
      title={type === 'member' ? '办理会员' : '账户充值'}
      onFinish={async (values) => {
        let res;
        const parmas = {
          ...values,
          familyId: data?.id,
        };

        if (type === 'member') {
          res = await registerMember(parmas);
        } else {
          res = await recharge(parmas);
        }

        if (res?.data) {
          message.success(res?.message);
          setRechargeMoney(0);
          onCancel(true);
        }
      }}
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      width={500}
    >
      <h3>
        <Space>
          <span> 账户余额:￥{data?.accountBalance || 0}</span>
          {rechargeMoney > 0 && (
            <Space style={{ color: 'red' }}>
              <span>+</span>
              <span>￥{floor(rechargeMoney, 2).toFixed(2)}</span>
              <span>=</span>
              <span>￥{floor(rechargeMoney + Number(data?.accountBalance), 2).toFixed(2)}</span>
            </Space>
          )}
        </Space>
      </h3>

      {type === 'member' && (
        <ProFormDigit
          label="会员折扣"
          name="discount"
          colProps={{ span: 12 }}
          min={0}
          max={1}
          rules={[{ required: true, message: '请输入会员折扣' }]}
          fieldProps={{ precision: 2, step: 0.01 }}
        />
      )}

      <ProFormMoney
        label="充值金额"
        name="accountBalance"
        colProps={{ span: 12 }}
        rules={[{ required: true, message: '请输入充值金额' }]}
        fieldProps={{
          onChange: (value) => {
            if (value && !isNaN(value)) {
              setRechargeMoney(Number(value));
            } else {
              setRechargeMoney(0);
            }
          },
        }}
      />
    </ModalForm>
  );
};

export default Charge;
