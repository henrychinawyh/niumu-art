/**
 * @name 表单列表域
 */

import useGetAllSubjects from '@/hooks/useGetAllSubjects';
import { CheckCircleOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import moment, { Moment } from 'moment';
import React, { useEffect, useMemo } from 'react';
import { createAttendance } from './services';

const useInitColumns = (reloadTable: () => void) => {
  const subjects = useGetAllSubjects(4);
  const [selectedSubject, setSelectedSubject] = React.useState<any>();

  const [selectedRange, setSelectedRange] = React.useState<Array<Moment>>([
    moment().subtract(7, 'days'),
    moment(),
  ]);

  useEffect(() => {
    // 选完销课时间触发查询
    reloadTable();
  }, [selectedRange]);

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
          onChange: (val: any, options: any) => {
            setSelectedSubject(options);
          },
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
              return Math.abs(current.diff(from, 'days')) >= 30;
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
        render: (_, r) => (
          <div>
            <div>{`${r.studentName}${r.isMember ? '(会员)' : ''}`}</div>
            {r.status === 99 && (
              <div
                style={{
                  color: '#ff4d4f',
                  fontWeight: 600,
                }}
              >
                已退班
              </div>
            )}
          </div>
        ),
      },
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
        width: 130,
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
                  if (record?.status === 99) {
                    message.error('该学员已退班，无法进行销课处理');
                    return;
                  }

                  if (+record?.accountBalance < +record?.realPrice) {
                    message.error('账户余额不足，不能销课，请充值');
                    return;
                  }

                  if (Number(record?.remainCourseCount) === 0) {
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
                        确认学员&nbsp;
                        <span
                          style={{
                            color: '#ff4d4f',
                            fontWeight: 600,
                          }}
                        >
                          {record.studentName}
                        </span>
                        &nbsp; 已在 <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{day}</span>{' '}
                        上课？
                      </div>
                    ),
                    okText: '已确认',
                    cancelText: '未上课',
                    onOk: async () => {
                      const attendDate = moment(day).format('YYYY-MM-DD HH:mm:ss');

                      console.log(
                        `${selectedSubject
                          ?.map((item: any) => item?.label)
                          ?.join('')}-销课 销课时间：${attendDate}`,
                      );

                      const params: any = {
                        studentClassId: record.id,
                        studentId: record.studentId,
                        classId: record.classId,
                        attendDate,
                        payId: record.payId,
                        familyId: record.familyId,
                        discount: record.discount,
                        isMember: record.isMember,
                        realPrice: record.realPrice,
                        consumeDetail: `${selectedSubject
                          ?.map((item: any) => item?.label)
                          ?.join('')}-销课 销课时间：${attendDate}`,
                        originPrice: record.originPrice,
                        consumeNum: 1,
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
                  cursor: record.status === 99 ? 'not-allowed' : 'pointer',
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
  }, [selectedRange, subjects, selectedSubject]);

  return columns;
};

export default useInitColumns;
