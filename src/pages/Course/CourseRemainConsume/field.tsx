export const useInitColumns: any = () => {
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '课程学期',
      dataIndex: 'courseSemester',
    },
    {
      title: '课程级别',
      dataIndex: 'gradeName',
    },
    {
      title: '剩余课销',
      dataIndex: 'remainConsume',
    },
  ];

  return columns;
};
