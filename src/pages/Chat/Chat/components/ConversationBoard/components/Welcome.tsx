/**
 * @name 欢迎语
 */

import { CloseOutlined } from '@ant-design/icons';
import { Welcome } from '@ant-design/x';
import { Button, ConfigProvider } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { WELCOME_STYLE_CONFIG } from '../../../config';
import styles from './index.less';

const WelcomeCom = forwardRef((props, ref) => {
  const [open, setOpen] = useState(true);

  useImperativeHandle(ref, () => ({
    setOpen,
    open,
  }));

  return open ? (
    <div className={styles.welcome}>
      <ConfigProvider
        theme={{
          algorithm: WELCOME_STYLE_CONFIG.algorithm,
        }}
      >
        <Welcome
          variant="borderless"
          style={
            {
              // backgroundImage: WELCOME_STYLE_CONFIG.background,
            }
          }
          icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
          title="你好，我是 AI 助手"
          description="请在下面输入框中输入您的问题，我会尽力为您回答~"
          extra={<Button onClick={() => setOpen(false)} icon={<CloseOutlined />} />}
        />
      </ConfigProvider>
    </div>
  ) : (
    <></>
  );
});

export default WelcomeCom;
