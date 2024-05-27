import { useModel } from '@umijs/max';
import { Card } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  return (
    <div>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: 500,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1>欢迎使用纽姆课销管理后台</h1>
        </div>
      </Card>
    </div>
  );
};

export default Welcome;
