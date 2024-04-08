import React from 'react';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
  initialState?: any;
};

export const AvatarName = () => {
  return <span className="anticon">{4353}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  initialState,
  // menu,
  // children,
}) => {
  const { currentUser } = initialState || {};
  const { account } = currentUser || {};
  return decodeURIComponent(account || '王宇航');
};
