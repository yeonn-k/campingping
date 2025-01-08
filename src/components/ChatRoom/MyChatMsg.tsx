import { useTimeFormat } from '@/utils/useTimeFormat';

interface MyChatMsgProps {
  message: string;
  createdAt: string;
  user: string;
}

const MyChatMsg = ({ message, createdAt, user }: MyChatMsgProps) => {
  return (
    <div
      className="flex flex-wrap justify-end"
      onClick={() => console.log(user)}
    >
      <div className="w-9/12 mr-3 mt-3 bg-Green text-white p-3 rounded-2xl flex flex-wrap">
        <p className="w-full">나</p>
        <p className="w-full">{message}</p>
      </div>
      <p className="text-description text-Gray mr-6">
        {useTimeFormat(createdAt)}
      </p>
    </div>
  );
};

export default MyChatMsg;
