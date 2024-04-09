import { request } from '@umijs/max';
import { TableListItemProps } from './interface';

// 获取学员列表
export async function getStudentList(params: API.ApiParams & API.PageParams) {
  return request('/api/students/getStudentList', {
    method: 'POST',
    params,
  });
}

// 创建学员
export async function createStudent(params: Partial<TableListItemProps>) {
  return request('/api/students/createStudent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 编辑学员
export async function editStudent(params: Partial<TableListItemProps>) {
  return request('/api/students/editStudent', {
    method: 'POST',
    params,
  });
}

// 删除学员
export async function deleteStudent(params: string[] | string) {
  return request('/api/students/deleteStudent', {
    method: 'POST',
    params,
  });
}
