import { request } from '@umijs/max';
import { TableListItemProps } from './interface';

// 获取课程列表
export async function getCourseList(params: API.ApiParams & API.PageParams) {
  return request('/api/courses/getCourseList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 创建课程
export async function createCourse(params: Partial<TableListItemProps>) {
  return request('/api/courses/createCourse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 编辑课程
export async function editCourse(params: Partial<TableListItemProps>) {
  return request('/api/courses/editCourse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 删除课程
export async function deleteCourse(params: any) {
  return request('/api/courses/deleteCourse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 获取课程下所有的级别
export async function getCourseGrade(params: any) {
  return request('/api/courses/getCourseGrade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 删除课程级别
export async function deleteGrade(params: any) {
  return request('/api/courses/deleteCourseGrade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}
