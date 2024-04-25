import { request } from '@umijs/max';
import { TableListItemProps } from './interface';

const stuPrefix = '/api/students';
const consumePrefix = '/api/consume';

// 获取学员列表
export async function getStudentList(params: API.ApiParams & API.PageParams) {
  return request(`${stuPrefix}/getStudentList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 创建学员
export async function createStudent(params: Partial<TableListItemProps>) {
  return request(`${stuPrefix}/createStudent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 编辑学员
export async function editStudent(params: Partial<TableListItemProps>) {
  return request(`${stuPrefix}/editStudent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 删除学员
export async function deleteStudent(params: any) {
  return request(`${stuPrefix}/deleteStudent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 获取单个学员
export async function getStudent(params: any) {
  return request(`${stuPrefix}/getStudent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 导出学员
export async function exportStudent(params: any) {
  return request(`${stuPrefix}/exportStudent`, {
    method: 'POST',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 新增学员消费记录
export async function addExtraConsume(params: any) {
  return request(`${consumePrefix}/addExtraConsume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 查看学员消费记录
export async function queryStudentConsumeRecord(params: any) {
  return request(`${consumePrefix}/queryStudentConsumeRecord`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 查看家庭消费记录
export async function queryFamilyConsumeRecord(params: any) {
  return request(`${consumePrefix}/queryFamilyConsumeRecord`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}

// 查询学员剩余课销
export async function querySurplus(params: any) {
  return request(`${stuPrefix}/getSurplus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
}
