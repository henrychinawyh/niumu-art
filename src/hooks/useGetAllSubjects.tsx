/**
 * @name 获取所有课程下的级别下的班级信息-树结构
 */

import { getAllSubjects } from '@/pages/Course/CourseList/services';
import { useEffect, useState } from 'react';

const useGetAllSubjects = (layer?: number) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getAllSubjects({ layer }).then((res) => {
      setOptions(res?.data || []);
    });
  }, []);

  return options;
};

export default useGetAllSubjects;
