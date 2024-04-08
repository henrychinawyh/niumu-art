import { request } from '@umijs/max';

const prefix = '/api/family';

// 获取家庭(按条件)
export async function query(params: API.ApiParams & API.PageParams) {
  return request(`${prefix}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 获取家庭列表
export async function queryList(params: API.ApiParams & API.PageParams) {
  return request(`${prefix}/queryList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 新建家庭
export async function add(params: any) {
  return request(`${prefix}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 添加学员与家庭的关系
export async function addRelationship(params: any) {
  return request(`${prefix}/addRelationship`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 办理会员
export async function registerMember(params: any) {
  return request(`${prefix}/registerMember`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 充值账户
export async function recharge(params: any) {
  return request(`${prefix}/recharge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}
