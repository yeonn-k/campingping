import { useTimeFormat } from '@/utils/TimeFormat';

interface UrChatMsgProps {
  message: string;
  createdAt: string;
  nickname: string;
  user: string;
}

const UrChatMsg = ({ nickname, message, createdAt }: UrChatMsgProps) => {
  return (
    <div>
      <div className="w-9/12 ml-3 mt-3 border border-LightGray p-3 rounded-2xl flex flex-wrap">
        <p className="w-full">{nickname}</p>
        <p className="w-full">{message}</p>
      </div>
      <p className="text-description text-Gray ml-6">
        {useTimeFormat(createdAt)}
      </p>
    </div>
  );
};
export default UrChatMsg;
