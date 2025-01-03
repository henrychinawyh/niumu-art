/**
 * @name 管理对话
 */

import { Conversations } from '@ant-design/x';
import { theme } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const ConversationList = () => {
  const { token } = theme.useToken();
  const style = {
    // background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const [groupable, setGroupable] = useState({});

  return <Conversations groupable={groupable} style={style} className={styles.conversationList} />;
};

export default ConversationList;
