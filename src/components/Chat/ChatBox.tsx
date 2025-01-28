interface ChatBox {
  roomId: number;
  nickname: string;
  lastMsg: string;
  createdAt: string;
  isRead: boolean;
}

const ChatBox = ({ nickname, createdAt, lastMsg, isRead }: ChatBox) => {
  return (
    <div
      className={`w-11/12 border ${isRead ? 'border-Gray' : 'border-Green'} px-4 py-3 rounded-md flex justify-between items-center`}
    >
      <div className="w-9/12">
        <p className="w-full text-[20px]">{nickname}</p>
        <p>{lastMsg}</p>
        <p className="text-description text-Gray">{createdAt}</p>
      </div>
    </div>
  );
};

export default ChatBox;
