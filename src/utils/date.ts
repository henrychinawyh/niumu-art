import moment, { Moment } from 'moment';

export const getWholeDateString = (
  date: Moment | Date | string,
  format = 'YYYY-MM-DD HH:mm:ss',
) => {
  return moment(date).format(format);
};

export const getDateString = (date: Moment | Date | string) =>
  getWholeDateString(date, 'YYYY-MM-DD');
