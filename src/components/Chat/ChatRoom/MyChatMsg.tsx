// import { timeFormat } from '@/utils/timeFormat';
import React, { forwardRef } from 'react';

interface MyChatMsgProps {
  message: string;
  createdAt: string;
  isRead: boolean;
}

const MyChatMsg = forwardRef<HTMLDivElement, MyChatMsgProps>(
  ({ message, createdAt, isRead }, ref) => {
    return (
      <div ref={ref} className="flex flex-wrap justify-end">
        <div className="w-9/12 mr-3 mt-3 bg-Green text-white p-3 rounded-2xl flex flex-wrap">
          <p className="w-full">나</p>
          <p className="w-full">{message}</p>
        </div>
        <div className="flex justify-between w-9/12 mr-3 px-3">
          <p className="text-description text-Gray">
            {isRead ? '' : '읽지 않음'}
          </p>
          <p className="text-description text-Gray">{createdAt}</p>
        </div>
      </div>
    );
  }
);

export default MyChatMsg;
