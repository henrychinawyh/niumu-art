export interface TableListItemProps {
  id: number;
  familyName: string;
  isMember: number;
  discount: number;
  accountBalance: number;
  createTime: string;
  lastCostTime: string;
  [keys: string]: any;
}

export type ChargeType = 'member' | 'account';
