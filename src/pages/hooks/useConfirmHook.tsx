import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import { useEffect, useState } from 'react';
import useCountDown from './useCountDown';

const useCountDownConfirm = (count: number) => {
  const [seconds, isActive, start, reset] = useCountDown(count);
  const [modal, contextHolder] = Modal.useModal();
  const [instance, setInstance] = useState<any>();
  const [okText, setOkText] = useState<any>();

  useEffect(() => {
    return () => {
      if (instance) {
        (instance as any)?.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (instance) {
      (instance as any)?.update({
        okText: (
          <div>
            {okText}
            {isActive ? `(${seconds}s)` : ''}
          </div>
        ),
        okButtonProps: {
          disabled: isActive,
        },
      });
    }
  }, [instance, seconds, isActive]);

  // 确认，并开始倒计时，倒计时完成之前无法点击确认按钮
  const confirm = (confirmProps: ModalFuncProps) => {
    start();
    setOkText(confirmProps?.okText || '确认');

    setInstance(
      modal.confirm({
        ...confirmProps,
        okText: (
          <div>
            {okText}
            {isActive ? `(${seconds}s)` : ''}
          </div>
        ),
        okButtonProps: {
          disabled: isActive,
        },
        onCancel: () => {
          reset();
          confirmProps?.onCancel?.();
        },
      }),
    );
  };

  return [confirm, contextHolder as any];
};

export { useCountDownConfirm };
