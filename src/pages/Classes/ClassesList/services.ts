import { request } from '@umijs/max';
import { CreateClassParams } from './interface';

const prefix = '/api/classes';

// createClass
//
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

// 删除班级
export async function editClass(params: any) {}
