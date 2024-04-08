import { request } from '@umijs/max';
import { TableListItemProps } from './interface';

const prefix = '/api/teachers';

// 获取教师列表
export async function getTeacherList(params: API.ApiParams & API.PageParams) {
  return request(`${prefix}/getTeacherList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 创建教师
export async function createTeacher(params: Partial<TableListItemProps>) {
  return request(`${prefix}/createTeacher`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 编辑教师
export async function editTeacher(params: Partial<TableListItemProps>) {
  return request(`${prefix}/editTeacher`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 删除教师
export async function deleteTeacher(params: any) {
  return request(`${prefix}/deleteTeacher`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 导出教师
export async function exportTeacher(params: any) {
  return request(`${prefix}/exportTeacher`, {
    method: 'POST',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 根据选择的课程搜索教师
export async function queryTeacherWithCourse(params: any) {
  return request(`${prefix}/queryTeacherWithCourse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 根据输入教师名称模糊搜索
export async function queryTeacherByName(params: any) {
  return request(`${prefix}/queryTeacherByName`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 根据班级id查询教师
export async function getTeacherByClassId(params: any) {
  return request(`${prefix}/getTeacherByClassId`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}
