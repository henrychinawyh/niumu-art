export interface TableListItemProps {
  id: number;
  name: string;
  status: number;
  createTs: string;
  updateTs: string;
  courseStuTotal: number;
  [keys: string]: any;
}

export interface GradeItemProps {
  value: number;
  label: string;
  gradeStuTotal: number;
  [keys: string]: any;
}
