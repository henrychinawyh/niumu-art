import { getWholeDateString } from '@/utils/date';
import type { Moment } from 'moment';
import React from 'react';

/**
 * @name 格式化时间格式-对完整时间格式进行换行
 */
interface IProps {
  time: string | Moment | Date;
}

const FormatDate: React.FC<IProps> = (props) => {
  const { time } = props;

  if (time) {
    const [time1, time2] = getWholeDateString(time).split(' ');

    return (
      <div>
        <div>{time1}</div>
        <div>{time2}</div>
      </div>
    );
  } else {
    return '';
  }
};

export default FormatDate;
