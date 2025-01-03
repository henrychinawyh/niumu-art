/**
 * @name 聊天面板
 */

import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Card, Flex, GetProp } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { useStore } from '../../hooks/useStore';
import InputPrompt from './components/InputPrompt';
import ResultBoard from './components/ResultBoard';
import Welcome from './components/Welcome';
import styles from './index.less';

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
  },
  local: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const ConversationBoard = () => {
  const welcomeRef = useRef<any>(null);

  const [promptVis, setPromptVis] = useState(true);

  const { messages } = useStore((state) => state);

  // 关闭提示语
  const closePrompt = useCallback((status: boolean) => {
    setPromptVis(status);
    welcomeRef?.current?.setOpen(false);
  }, []);

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 0 }}
      styles={{
        body: {
          height: '100%',
        },
      }}
      className={styles.conversationBoard}
    >
      <Flex
        flex={1}
        vertical
        style={{
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Welcome ref={welcomeRef} />

        {promptVis ? (
          <Flex
            flex={1}
            style={{
              overflowY: 'auto',
            }}
          >
            <ResultBoard />
          </Flex>
        ) : (
          <Flex flex={1} style={{ overflowY: 'auto', marginBottom: 10 }}>
            <Bubble.List
              style={{ width: '100%' }}
              roles={roles}
              items={messages.map(({ id, message, status }) => ({
                key: id,
                loading: status === 'loading',
                role: status === 'local' ? 'local' : 'ai',
                content: message,
              }))}
            />
          </Flex>
        )}

        <InputPrompt closePrompt={closePrompt} />
      </Flex>
    </Card>
  );
};

export default ConversationBoard;
