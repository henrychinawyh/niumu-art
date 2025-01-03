import { CHAT_MODEL_CONFIG } from '@/utils/constant';
import { useXAgent, useXChat, XRequest } from '@ant-design/x';
import { useModel } from '@umijs/max';
import { useEffect } from 'react';
import { useStore } from './useStore';

export const useRequest: () => any = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { apiKey } = currentUser || {};
  const { setMessages } = useStore((state) => state);

  const { create } = XRequest({
    baseURL: CHAT_MODEL_CONFIG.BASE_URL + CHAT_MODEL_CONFIG.PATH,
    model: CHAT_MODEL_CONFIG.MODEL,
    dangerouslyApiKey: apiKey,
  });

  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { message } = info;
      const { onSuccess, onError } = callbacks;

      let content = '';
      try {
        create(
          {
            messages: [
              {
                role: 'user',
                content: message,
              },
            ],
            stream: true,
          },
          {
            onSuccess: () => {
              onSuccess(content);
            },
            onError: (error) => {
              onError(error);
            },
            onUpdate: (response) => {
              try {
                if (!response.data?.includes('[DONE]')) {
                  const data = JSON.parse(response.data);
                  content += data?.choices[0].delta.content;
                }
              } catch (err) {
                console.log(err);
              }
            },
          },
        );
      } catch (err) {
        console.log(err);
      }
    },
  });

  // Chat messages
  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: 'Waiting...',
    requestFallback: 'Mock failed return. Please try again later.',
  });

  useEffect(() => {
    console.log('messages-changed');
    setMessages(messages);
  }, [messages]);

  return [onRequest];
};
