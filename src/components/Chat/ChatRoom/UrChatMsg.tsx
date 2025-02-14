import React from 'react';
import { timeFormat } from '@/utils/timeFormat';

interface UrChatMsgProps {
  message: string;
  createdAt: string;
  nickname: string;
}

const UrChatMsg = ({ message, createdAt, nickname }: UrChatMsgProps) => {
  return (
    <div>
      <div className="w-9/12 ml-3 mt-3 border border-LightGray p-3 rounded-2xl flex flex-wrap">
        <p className="w-full">{nickname}</p>
        <p className="w-full">{message}</p>
      </div>
      <p className="text-description text-Gray ml-6">{timeFormat(createdAt)}</p>
    </div>
  );
};

export default UrChatMsg;
