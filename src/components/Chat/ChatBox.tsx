import { timeFormat } from '@/utils/timeFormat';

interface ChatBox {
  roomId: number;
  nickname: string;
  lastMsg: string;
  lastMsgTime: string;
  unreadCount: number;
}

const ChatBox = ({ nickname, lastMsgTime, lastMsg, unreadCount }: ChatBox) => {
  return (
    <div
      className={`w-11/12 border ${unreadCount > 0 ? 'border-Green' : 'border-Gray'} px-4 py-3 rounded-md flex justify-between items-center`}
    >
      <div className="w-9/12">
        <p className="w-full text-[20px]">{nickname}</p>
        <p>{lastMsg}</p>
        <p className="text-description text-Gray">{timeFormat(lastMsgTime)}</p>
      </div>
      {unreadCount > 0 && (
        <div className="flex justify-center items-center w-7 h-7 rounded-full bg-Green text-white">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
