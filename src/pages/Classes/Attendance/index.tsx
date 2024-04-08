/* eslint-disable no-param-reassign */
/**
 * @name 班级考勤表
 */
import { getTeacherByClassId } from '@/pages/Teacher/TeacherList/services';
import { getTotalWidth } from '@/utils';
import { getDateStringArray } from '@/utils/date';
import { ActionType, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Space, message } from 'antd';
import React, { useRef, useState } from 'react';
import useInitColumns from './fields';
import { TeacherProps } from './interface';
import { getAttendanceList } from './services';

const Attendance: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [teacher, setTeacher] = useState<TeacherProps>();
  const columns = useInitColumns(() => {
    tableRef.current?.reload();
  });

  // 查询教师
  const queryTeacher = async (classId: number) => {
    const res = await getTeacherByClassId({ classId });

    setTeacher(res?.data?.[0]);
  };

  return (
    <div>
      <ProTable<any>
        bordered
        actionRef={tableRef}
        formRef={formRef}
        rowKey={'id'}
        manualRequest={true}
        request={async (options) => {
          // 这里为切换销课时间后reload做特殊处理
          options = { ...options, ...formRef.current?.getFieldsValue() };

          if (!options?.subject || options?.subject?.length < 4) {
            message.error('课程类目需要选择到班级才能查询');
            return {
              success: false,
            };
          }

          if (options?.costTime?.length !== 2) {
            message.error(`考勤时间范围需要选择日期范围才能查询`);
            return {
              success: false,
            };
          }

          const { subject, costTime, current, pageSize } = options;
          const [courseId, courseSemester, gradeId, classId] = subject || [];

          const params: any = {
            courseId,
            gradeId,
            classId,
            current,
            pageSize,
            courseSemester,
          };

          const [costTimeStart, costTimeEnd] = getDateStringArray(costTime);
          params.costTimeStart = costTimeStart;
          params.costTimeEnd = costTimeEnd;

          const res = await getAttendanceList(params);
          await queryTeacher(classId); // 查询班级的教师

          return {
            data: res?.data?.list,
            total: res?.data?.total ?? 0,
            success: true,
          };
        }}
        pagination={{
          defaultPageSize: 10,
        }}
        columns={columns}
        scroll={{
          x: getTotalWidth(columns),
        }}
        tableAlertRender={false}
        options={false}
        footer={() => (
          <Space
            style={{
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                color: '#ff4d4f',
                fontWeight: 600,
              }}
            >
              注：双击日期下方的单元格可以编辑考勤
            </span>
            <span>任课教师：{teacher?.teacherName}</span>
          </Space>
        )}
        toolBarRender={false}
      />
    </div>
  );
};

export default Attendance;
