/**
 * @name 学员关联家庭modal
 */

import { add, addRelationship, query } from '@/pages/Family/services';
import { convertObjectToArray } from '@/utils';
import {
  ModalForm,
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React from 'react';
import { TableListItemProps } from '../interface';

export const RELATE_WAY = {
  0: '新建家庭',
  1: '关联已有家庭',
};

interface IProps {
  onCancel: (refresh?: boolean) => void;
  visible: boolean;
  data?: Partial<TableListItemProps> | null;
}

const RelateFamily: React.FC<IProps> = (props) => {
  const { data = {}, visible, onCancel } = props;

  const [form] = Form.useForm();

  return (
    <ModalForm
      title="关联家庭"
      modalProps={{
        onCancel: () => {
          onCancel();
        },
        destroyOnClose: true,
        maskClosable: false,
      }}
      open={visible}
      form={form}
      initialValues={{
        familyName: `${data?.stuName}的家庭`,
        relateWay: '0',
      }}
      onFinish={async (values) => {
        const { relateWay } = values;
        let params: any = {};
        let fn;

        if (relateWay === '1') {
          // 建立学员与已有家庭的关联关系
          params = {
            familyId: values?.familyId,
            studentId: data?.id,
          };
          fn = addRelationship;
        } else {
          // 新建家庭并建立家庭与学员的关联关系
          if (!data?.idCard) {
            message.error('该学员没有身份证号，请完善后重试');
            return false;
          }

          params = {
            familyName: values?.familyName,
            mainMemberId: data?.idCard,
            studentId: data?.id,
          };
          fn = add;
        }

        const res = await fn(params);
        if (res.data) {
          message.success(res.message);
          onCancel?.(true);
        }
      }}
      grid
      layout="horizontal"
      rowProps={{
        gutter: 10,
      }}
    >
      <ProFormRadio.Group
        label="关联方式"
        name="relateWay"
        options={convertObjectToArray(RELATE_WAY)}
        colProps={{ span: 24 }}
      />

      <ProFormDependency name={['relateWay']}>
        {({ relateWay }) => {
          return relateWay === '1' ? (
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
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
};

export default RelateFamily;
