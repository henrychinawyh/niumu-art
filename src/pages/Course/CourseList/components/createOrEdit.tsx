import { convertObjectToArray } from '@/utils';
import { TERM } from '@/utils/constant';
import {
  ModalForm,
  ProForm,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
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
      width={800}
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
        if (type === 'create' && !values?.grades?.length) {
          message.error('请至少添加一个级别');
          return false;
        }

        if (
          Array.isArray(values.grades) &&
          Array.from(
            new Set(values.grades.map((item: any) => `${item.courseSemester}-${item.name}`)),
          )?.length < values.grades.length
        ) {
          message.error('级别名称不能重复');
          return;
        }

        let fn = createCourse;
        if (type === 'edit') {
          values.id = data?.id; // 课程id
          fn = editCourse;
        }

        values.grades = values.grades?.filter(
          (item: any) =>
            item?.courseCount && item?.courseOriginPrice && item?.courseSemester && item?.name,
        );

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
            span: 6,
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
              <ProFormSelect
                options={convertObjectToArray(TERM)}
                name="courseSemester"
                initialValue="1"
                colProps={{ span: 4 }}
              />
              <ProFormText
                placeholder={'请输入级别名称'}
                name="name"
                labelCol={{ span: 0 }}
                rules={[
                  {
                    required: true,
                    message: '请输入级别名称',
                  },
                ]}
                colProps={{ span: 8 }}
              />

              <ProFormText
                name="courseOriginPrice"
                placeholder="请输入课程价格"
                rules={[
                  {
                    required: true,
                    message: '请输入课程价格',
                  },
                ]}
                labelCol={{ span: 0 }}
                colProps={{ span: 6 }}
              />

              <ProFormText
                name="courseCount"
                placeholder="请输入课程时数"
                rules={[
                  {
                    required: true,
                    message: '请输入课程时数',
                  },
                ]}
                labelCol={{ span: 0 }}
                colProps={{ span: 6 }}
              />
            </ProForm.Group>
          </ProFormList>
        </div>
      )}
    </ModalForm>
  );
};

export default CreateOrEdit;
