import { timeFormat } from '@/utils/timeFormat';

interface MyChatMsgProps {
  message: string;
  createdAt: string;
}

const MyChatMsg = ({ message, createdAt }: MyChatMsgProps) => {
  return (
    <div className="flex flex-wrap justify-end">
      <div className="w-9/12 mr-3 mt-3 bg-Green text-white p-3 rounded-2xl flex flex-wrap">
        <p className="w-full">나</p>
        <p className="w-full">{message}</p>
      </div>
      <p className="text-description text-Gray mr-6">{timeFormat(createdAt)}</p>
    </div>
  );
};

export default MyChatMsg;
