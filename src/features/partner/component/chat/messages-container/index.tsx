import { IStep } from "@/types/step-type";
import Message from "./message";
interface Props {
  navigate?: (to: string) => void;
  messages: IStep[];
}

const MessagesContainer = ({ messages }: Props) => {
  return (
    <div className="flex flex-col w-full h-full gap-5">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessagesContainer;
