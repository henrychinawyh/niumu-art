import moment, { Moment } from 'moment';

// 格式化期望的时间格式
export const getWholeDateString = (
  date: Moment | Date | string,
  format = 'YYYY-MM-DD HH:mm:ss',
) => {
  return moment(date).format(format);
};

// 传入一个生日，获得当前年龄
export const getAgeByBirth = (birth: Moment) => moment().diff(birth, 'years');

export const getDateString = (date: any = moment()) => getWholeDateString(date, 'YYYY-MM-DD');
