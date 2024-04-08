import { getCookie } from '@/utils/cookie';
import React from 'react';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  return <span className="anticon">{4353}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  // console.log(getCookie('username'));

  return decodeURIComponent(getCookie('username') || '王宇航');
};
