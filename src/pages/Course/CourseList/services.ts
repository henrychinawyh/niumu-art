import { request } from '@umijs/max';
import { TableListItemProps } from './interface';

const prefix = '/api/courses';

// 获取课程列表
export async function getCourseList(params: API.ApiParams & API.PageParams) {
  return request(`${prefix}/getCourseList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 获取所有课程
export async function getAllCourseList(params: any) {
  return request(`${prefix}/getAllCourses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 创建课程
export async function createCourse(params: Partial<TableListItemProps>) {
  return request(`${prefix}/createCourse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 编辑课程
export async function editCourse(params: Partial<TableListItemProps>) {
  return request(`${prefix}/editCourse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 删除课程
export async function deleteCourse(params: any) {
  return request(`${prefix}/deleteCourse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 获取课程下所有的级别
export async function getCourseGrade(params: any) {
  return request(`${prefix}/getCourseGrade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 删除课程级别
export async function deleteGrade(params: any) {
  return request(`${prefix}/deleteCourseGrade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 编辑课程级别
export async function editCourseGrade(params: any) {
  return request(`${prefix}/editCourseGrade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}
