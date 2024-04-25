export interface TableListItemProps {
  id: number;
  courseName: string;
  gradeName: string;
  name: string;
  teaName: string;
  stuTotal: number;
  status: number;
  createTs: string;
  updateTs: string;
  [keys: string]: any;
}

export interface CreateClassParams {
  courseId: number;
  gradeId: number;
  id: number;
  name: string;
  teacherId: string;
  stuGroup: number[];
}
