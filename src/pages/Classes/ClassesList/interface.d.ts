export interface StudentProps {
  id: number;
  name: string;
  birthDate: string;
  sex: number;
  remainCourseCount: number;
  payId: number;
  studentId: number;
}

export interface TableListItemProps {
  classId: number;
  className: string;
  courseName: string;
  gradeName: string;
  courseId: number;
  gradeId: number;
  teacherName: string;
  teacherId: number;
  total: number;
  createTs: string;
  studentList?: Array<StudentProps>;
  [keys: string]: any;
}

export interface CreateClassParams {
  courseId: number;
  gradeId: number;
  classId: number;
  name: string;
  teacherId: string;
  studentIds: number[];
}
