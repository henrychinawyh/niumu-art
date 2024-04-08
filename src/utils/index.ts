import { ProColumns } from '@ant-design/pro-components';
import { DefaultOptionType } from 'antd/es/select';
import moment from 'moment';

// 将对象中属性值为空的key删除，避免后端接口报错
export const deleteEmptyKey = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'string' && obj[key].trim() === '') {
      delete obj[key];
    } else if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      Object.keys(obj[key]).length === 0
    ) {
      delete obj[key];
    } else if (Array.isArray(obj[key]) && obj[key].length === 0) {
      delete obj[key];
    }
  });
  return obj;
};

// 下载xlsx文件
export const downloadExcel = (data: any, fileName: string) => {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', `${fileName}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // 下载完成移除元素
  window.URL.revokeObjectURL(url); // 释放掉blob对象
};

// 算出columns中width的总和
export const getTotalWidth = (columns: ProColumns<any>[]) => {
  let total = 0;

  if (Array.isArray(columns)) {
    columns
      .filter((item) => !!item.width)
      .forEach((item: any, index) => {
        if (index !== columns.length - 1) {
          total += item?.width;
        }
      });
    return `${total}px`;
  }

  return true;
};

// 将对象转换为数组的label value格式
export const convertObjectToArray = (obj: any) => {
  if (!obj) return [];
  const arr: Array<{ label: any; value: any }> = [];
  Object.keys(obj).forEach((key) => {
    arr.push({ label: obj[key], value: key });
  });
  return arr;
};

// 使用moment.js算出两个时间年份的差值，并做绝对值返回
export const getYearDiff = (date1: any, date2: any) => {
  const year1 = moment(date1).year();
  const year2 = moment(date2).year();
  return Math.abs(year1 - year2);
};

// 将数组转换为下拉列表格式
export const convertArrayToOptions = (
  arr: any[],
  valueKey: string,
  labelKey: string,
): DefaultOptionType[] => {
  if (Array.isArray(arr)) {
    return arr.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));
  } else {
    return [];
  }
};
