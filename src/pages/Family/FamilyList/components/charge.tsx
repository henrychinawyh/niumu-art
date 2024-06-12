/**
 * @name 充值弹框
 */

import { ModalForm, ProFormDigit, ProFormMoney } from '@ant-design/pro-components';
import { Form } from 'antd';
import { ChargeType, TableListItemProps } from '../interface';

interface IProps {
  type: ChargeType | undefined;
  data: Partial<TableListItemProps>;
  visible: boolean;
  onCancel: () => void;
}

const Charge: React.FC<IProps> = (props) => {
  const { type, data, visible, onCancel } = props || {};

  const [form] = Form.useForm<any>();

  return (
    <ModalForm
      form={form}
      modalProps={{
        onCancel: () => {
          onCancel();
        },
        destroyOnClose: true,
        maskClosable: false,
      }}
      open={visible}
      autoFocusFirstInput
      title={type === 'member' ? '办理会员' : '账户充值'}
      onFinish={async (values) => {
        console.log(values);
      }}
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      width={500}
    >
      <h3>账户余额：</h3>

      {type === 'member' && (
        <ProFormDigit
          label="会员折扣"
          name="discount"
          colProps={{ span: 12 }}
          min={0}
          max={1}
          rules={[{ required: true, message: '请输入会员折扣' }]}
          fieldProps={{ precision: 2 }}
        />
      )}

      <ProFormMoney
        label="充值金额"
        name="money"
        colProps={{ span: 12 }}
        rules={[{ required: true, message: '请输入充值金额' }]}
      />
    </ModalForm>
  );
};

export default Charge;
