/**
 * @name 聊天室
 */

import { Col, Row } from 'antd';

import ConversationBoard from './components/ConversationBoard';
import ConversationList from './components/ConversationList';
import styles from './index.less';

const Chat = () => {
  return (
    <div className={styles.container}>
      <Row className={styles.row}>
        <Col span={6} className={styles.col}>
          <ConversationList />
        </Col>
        <Col span={18} className={styles.col}>
          <ConversationBoard />
        </Col>
      </Row>
    </div>
  );
};

export default Chat;
