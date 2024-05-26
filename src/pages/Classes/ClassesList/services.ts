import { request } from '@umijs/max';
import { CreateClassParams } from './interface';

const prefix = '/api/classes';
export const purchasePrefix = '/api/purchase';

// createClass
//
// 创建班级
export async function createClass(params?: Partial<CreateClassParams>) {
  return request(`${prefix}/createClass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 查询班级
export async function queryClass(params: API.ApiParams & API.PageParams) {
  return request(`${prefix}/getClassList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 查询班级中对应的学员
export async function getStudentsInClass(params: any) {
  return request(`${prefix}/getStudentsInClass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 编辑班级
export async function editClass(params?: Partial<CreateClassParams>) {
  return request(`${prefix}/editClass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 查询学员是否还有未销的课时
export async function hasRemianCourseCount(params?: any) {
  return request(`${prefix}/hasRemianCourseCount`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 删除学员
export async function deleteStudentOfClass(params?: any) {
  return request(`${prefix}/deleteStudentOfClass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 删除班级
export async function deleteClass(params?: any) {
  return request(`${prefix}/deleteClass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 新增课时
export async function addCourseClass(params?: any) {
  return request(`${purchasePrefix}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}
