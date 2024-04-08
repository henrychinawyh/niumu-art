import { query } from '@/pages/Family/services';
import { convertObjectToArray } from '@/utils';
import { getBirthdayByIdCard } from '@/utils/birthday';
import { GENDER, RELATIONSHIP } from '@/utils/constant';
import { getDateString } from '@/utils/date';
import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React from 'react';
import { TableListItemProps } from '../interface';
import { createStudent, editStudent } from '../services';
import { RELATE_WAY } from './relateFamily';

type FormSubmitProps = Partial<
  Pick<
    TableListItemProps,
    | 'idCard'
    | 'phoneNumber'
    | 'sex'
    | 'stuName'
    | 'birthDate'
    | 'id'
    | 'hasCousin'
    | 'schoolName'
    | 'relateWay'
    | 'familyId'
    | 'familyName'
  >
>;

interface IProps {
  title: string;
  onCancel: (refresh?: boolean) => void;
  visible: boolean;
  type?: 'create' | 'edit';
  data?: Partial<TableListItemProps> | null;
}

const CreateOrEdit: React.FC<IProps> = (props) => {
  const { data = {}, title, visible, onCancel, type = 'create' } = props ?? {};

  const [form] = Form.useForm<FormSubmitProps>();

  return (
    <ModalForm<FormSubmitProps>
      title={title}
      modalProps={{
        onCancel: () => {
          onCancel();
        },
        destroyOnClose: true,
        maskClosable: false,
      }}
      open={visible}
      autoFocusFirstInput
      form={form}
      initialValues={{
        ...data,
        sex: data?.sex ? `${data?.sex}` : `1`,
        birthDate: data?.birthDate ? getDateString(data?.birthDate) : undefined,
        hasCousin: data?.hasCousin ? data.hasCousin?.split(',') : [],
      }}
      onFinish={async (values) => {
        const params: FormSubmitProps = {
          ...values,
          idCard: values.idCard?.toUpperCase(),
        };

        // 处理兄妹数据
        if (Array.isArray(values?.hasCousin) && values?.hasCousin?.length > 0) {
          params.hasCousin = values.hasCousin.join(',');
        }

        // 判断是否为新建家庭还是关联家庭
        if (values.relateWay) {
          params.relateWay = values.relateWay;
          if (values.relateWay === '1') {
            params.familyId = values.familyId;
          } else {
            params.familyName = values.familyName;
          }
        }

        let fn = createStudent;
        if (type === 'edit') {
          params.id = data?.id;
          fn = editStudent;
        }

        try {
          const res = await fn(params);

          if (res) {
            message.success('操作成功');
            onCancel(true);
          }
        } catch (err) {
          console.log(err);
        }

        return true;
      }}
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
      onFieldsChange={(changeFields) => {
        const { name, value } = changeFields[0];
        if (name[0] === 'idCard' && value?.length === 18) {
          form.setFieldsValue({
            birthDate: getBirthdayByIdCard(value),
          });
        }
      }}
    >
      <ProFormText
        label="学员姓名"
        name="stuName"
        colProps={{ span: 12 }}
        rules={[
          { required: true, message: '学员姓名必填' },
          {
            max: 10,
            message: '学员姓名不能超过10个字符',
          },
        ]}
      />

      <ProFormText
        label="手机号"
        name="phoneNumber"
        colProps={{ span: 12 }}
        rules={[
          { required: true, message: '手机号必填' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '手机号格式不正确',
          },
        ]}
      />

      <ProFormRadio.Group
        label="性别"
        name="sex"
        colProps={{ span: 12 }}
        options={convertObjectToArray(GENDER)}
        radioType="button"
      />

      <ProFormText
        label="身份证号"
        name="idCard"
        colProps={{ span: 12 }}
        rules={[
          {
            required: true,
            message: '身份证号必填',
          },
          {
            pattern:
              /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '身份证号格式不正确',
          },
        ]}
      />

      <ProFormDatePicker
        label="生日"
        name="birthDate"
        colProps={{ span: 12 }}
        rules={[{ required: true, message: '生日必选' }]}
        dataFormat="YYYY-MM-DD"
        disabled
      />

      <ProFormSelect
        label="有无兄妹"
        name="hasCousin"
        colProps={{ span: 12 }}
        allowClear
        mode="multiple"
        options={convertObjectToArray(RELATIONSHIP)}
      />

      <ProFormText label="就读学校" name="schoolName" colProps={{ span: 12 }} />

      {type === 'create' && (
        <ProForm.Group>
          <ProFormRadio.Group
            label="关联方式"
            name="relateWay"
            options={convertObjectToArray(RELATE_WAY)}
            colProps={{ span: 12 }}
          />

          <ProFormDependency name={['relateWay']}>
            {({ relateWay }) => {
              return relateWay ? (
                relateWay === '1' ? (
                  <ProFormSelect
                    placeholder="请选择关联家庭"
                    colProps={{ span: 12 }}
                    request={async (params) => {
                      const { keyWords } = params;

                      if (keyWords) {
                        // 查询家庭
                        const res = await query({
                          familyName: keyWords,
                        });

                        return res?.data?.list?.map((item: any) => ({
                          label: item.familyName,
                          value: item.id,
                        }));
                      }

                      return [];
                    }}
                    debounceTime={400}
                    label="关联家庭"
                    name="familyId"
                    rules={[{ required: true, message: '关联家庭必选' }]}
                    showSearch
                  />
                ) : (
                  <ProFormText
                    label="家庭名称"
                    name="familyName"
                    colProps={{ span: 12 }}
                    placeholder="请输入家庭名称"
                    rules={[{ required: true, message: '家庭名称必填' }]}
                  />
                )
              ) : null;
            }}
          </ProFormDependency>
        </ProForm.Group>
      )}
    </ModalForm>
  );
};

export default CreateOrEdit;
