import { ModalForm, ProForm, ProFormList, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React from 'react';
import styles from '../index.less';
import { TableListItemProps } from '../interface';
import { createCourse, editCourse } from '../services';

type FormSubmitProps = any;

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
      width={500}
      title={title}
      modalProps={{
        onCancel: () => {
          onCancel();
        },
        destroyOnClose: true,
        maskClosable: false,
      }}
      visible={visible}
      autoFocusFirstInput
      form={form}
      onFinish={async (values) => {
        if (!values.grades?.length && type === 'create') {
          message.error('请至少添加一个级别');
          return false;
        }

        let fn = createCourse;
        if (type === 'edit') {
          values.id = data?.id; // 课程id
          fn = editCourse;
        }

        try {
          const res = await fn(values);

          if (res) {
            message.success('提交成功');
            onCancel(true);
          }
        } catch (err) {
          console.log(err);
        }

        return true; // 在最后关闭弹框
      }}
      initialValues={{
        name: data?.name,
      }}
      grid
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          label="课程名称"
          placeholder="请输入课程名称"
          rules={[
            {
              required: true,
              message: '请输入课程名称',
            },
          ]}
          colProps={{
            span: 12,
          }}
        />
      </ProForm.Group>

      {type === 'create' && (
        <div>
          <h4 className={styles.required}>新增级别</h4>

          <ProFormList
            name="grades"
            creatorButtonProps={{
              position: 'bottom',
              creatorButtonText: '新建一行',
            }}
            copyIconProps={false}
          >
            <ProForm.Group key="courseNames">
              <ProFormText
                width="sm"
                placeholder={'请输入级别名称'}
                name="name"
                labelCol={{ span: 0 }}
                rules={[
                  {
                    required: true,
                    message: '请输入级别名称',
                  },
                ]}
              />
            </ProForm.Group>
          </ProFormList>
        </div>
      )}
    </ModalForm>
  );
};

export default CreateOrEdit;
