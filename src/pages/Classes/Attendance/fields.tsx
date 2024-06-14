/**
 * @name 表单列表域
 */

import useGetAllSubjects from '@/hooks/useGetAllSubjects';
import { CheckCircleOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import moment, { Moment } from 'moment';
import React, { useMemo } from 'react';
import { createAttendance } from './services';

const useInitColumns = (reloadTable: () => void) => {
  const subjects = useGetAllSubjects(4);

  const [selectedRange, setSelectedRange] = React.useState<Array<Moment>>([
    moment().subtract(7, 'days'),
    moment(),
  ]);

  const columns: any = useMemo(() => {
    let initColumns: ProColumns<any>[] = [
      {
        title: '课程类目',
        hideInTable: true,
        valueType: 'cascader',
        formItemProps: {
          name: 'subject',
        },
        fieldProps: {
          options: subjects,
          expandTrigger: 'hover',
          // changeOnSelect: true,
        },
        width: 100,
      },
      {
        title: '销课时间',
        dataIndex: 'costTime',
        hideInTable: true,
        width: 100,
        valueType: 'dateRange',
        formItemProps: {
          initialValue: selectedRange,
        },
        fieldProps: {
          disabledDate: (current: Moment, { from }: { from: Moment }) => {
            if (from) {
              return Math.abs(current.diff(from, 'days')) >= 14;
            }

            return false;
          },
          onChange: (val: [Moment, Moment]) => {
            setSelectedRange(val);
          },
        },
      },
      {
        title: '学员姓名',
        dataIndex: 'studentName',
        hideInSearch: true,
        width: 100,
        fixed: 'left',
        render: (_, r) => `${r.studentName}${r.isMember ? '(会员)' : ''}`,
      },
      // {
      //   title: '学员课销(节)',
      //   dataIndex: 'paidCourseCount',
      //   hideInSearch: true,
      //   width: 120,
      //   fixed: 'left',
      // },
      {
        title: '剩余课销(节)',
        dataIndex: 'remainCourseCount',
        hideInSearch: true,
        width: 100,
        fixed: 'left',
      },
      {
        title: '课时单价(元)',
        dataIndex: 'realPrice',
        hideInSearch: true,
        width: 100,
        fixed: 'left',
      },
      {
        title: '剩余课销费用(元)',
        dataIndex: 'remainCost',
        hideInSearch: true,
        width: 120,
        fixed: 'left',
      },
      {
        title: '账户余额(元)',
        dataIndex: 'accountBalance',
        hideInSearch: true,
        width: 100,
        fixed: 'left',
      },
    ];

    if (selectedRange?.[0] && selectedRange?.[1]) {
      const num = Math.abs(selectedRange[1].diff(selectedRange[0], 'days'));

      if (num >= 0) {
        for (let i = 0; i <= num; i++) {
          const day = selectedRange[0].add(i, 'days').format('YYYY-MM-DD');

          initColumns.push({
            title: day,
            dataIndex: day,
            hideInSearch: true,
            width: 100,
            align: 'center',
            onCell: (record) => {
              return {
                onDoubleClick: () => {
                  if (record?.remainCourseCount === 0) {
                    message.warning('该学员已无剩余课销，无法考勤');
                    return;
                  }

                  if (record?.attendanceRecords?.includes(day)) {
                    message.warning('该学员已考勤');
                    return;
                  }

                  Modal.confirm({
                    title: `考勤编辑`,
                    content: (
                      <div>
                        确认学员
                        <span
                          style={{
                            color: '#ff4d4f',
                            fontWeight: 600,
                          }}
                        >
                          {record.studentName}
                        </span>
                        已上课？
                      </div>
                    ),
                    okText: '已确认',
                    cancelText: '未上课',
                    onOk: async () => {
                      const params: any = {
                        studentClassId: record.id,
                        studentId: record.studentId,
                        classId: record.classId,
                        attendDate: moment(day).format('YYYY-MM-DD HH:mm:ss'),
                        payId: record.payId,
                      };

                      const res = await createAttendance(params);

                      if (res?.data) {
                        // 新增考勤成功，刷新
                        reloadTable();
                      }
                    },
                  });
                },
                style: {
                  cursor: 'pointer',
                },
              };
            },
            render: (_: any, record: any) => {
              return record?.attendanceRecords?.includes(day) ? (
                <CheckCircleOutlined
                  style={{
                    fontSize: 20,
                    color: '#2bb673',
                  }}
                />
              ) : null;
            },
          });
        }
      }
    } else {
      initColumns = initColumns.slice(0, 6);
    }

    return initColumns;
  }, [selectedRange, subjects]);

  return columns;
};

export default useInitColumns;
