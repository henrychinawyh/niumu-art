import moment, { Moment } from 'moment';

export const getWholeDateString = (
  date: Moment | Date | string,
  format = 'YYYY-MM-DD HH:mm:ss',
) => {
  return moment(date).format(format);
};

export const getDateString = (date: any = moment()) => getWholeDateString(date, 'YYYY-MM-DD');
