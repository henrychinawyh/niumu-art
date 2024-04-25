import { request } from '@umijs/max';
import { CreateClassParams } from './interface';

const prefix = '/api/classes';

// 创建班级
export async function createClass(params: CreateClassParams) {
  return request(`${prefix}/createClass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 获取课程列表
// export async function getCourseList(params: API.ApiParams & API.PageParams) {
//   return request(`${prefix}/getCourseList`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: params,
//   });
// }

// 删除班级
export async function editClass(params: any) {}
