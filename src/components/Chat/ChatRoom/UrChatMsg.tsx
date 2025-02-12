import React, { forwardRef } from 'react';

interface UrChatMsgProps {
  message: string;
  createdAt: string;
  nickname: string;
}

const UrChatMsg = forwardRef<HTMLDivElement, UrChatMsgProps>(
  ({ message, createdAt, nickname }, ref) => {
    return (
      <div ref={ref}>
        <div className="w-9/12 ml-3 mt-3 border border-LightGray p-3 rounded-2xl flex flex-wrap">
          <p className="w-full">{nickname}</p>
          <p className="w-full">{message}</p>
        </div>
        <p className="text-description text-Gray ml-6">{createdAt}</p>
      </div>
    );
  }
);

UrChatMsg.displayName = 'UrChatMsg';

export default UrChatMsg;
