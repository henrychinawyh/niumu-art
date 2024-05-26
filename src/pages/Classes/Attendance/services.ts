import { request } from '@umijs/max';

const prefix = '/api/attendance';

// 获取班级考勤表
export async function getAttendanceList(params?: any) {
  return request(`${prefix}/getAttendanceList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 记录一次考勤
export async function recordAttendance(params?: any) {
  return request(`${prefix}/recordAttendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}
