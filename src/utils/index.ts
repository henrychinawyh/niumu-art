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
