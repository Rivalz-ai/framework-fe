import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  resumeThreadErrorState,
  threadIdToResumeState,
  useChatInteract,
  useChatSession,
  useConfig,
} from "@chainlit/react-client";

interface Props {
  id: string;
}

export default function AutoResumeThread({ id }: Props) {
  const { config } = useConfig();
  const { clear, setIdToResume } = useChatInteract();

  const { session, connect, disconnect } = useChatSession();
  const idToResume = useRecoilValue(threadIdToResumeState);
  const router = useRouter();
  const [resumeThreadError, setResumeThreadError] = useRecoilState(
    resumeThreadErrorState
  );

  useEffect(() => {
    const connectToServer = async () => {
      if (!config?.threadResumable) return;
      setIdToResume(id);

      // Brief delay to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 300));

      clear();
      disconnect();
      connect({
        userEnv: {},
        //transports: ["websocket"],
      });
      if (!config?.dataPersistence) {
        router.push("/");
      }
    };

    // Connect to server whether it's new chat or resuming thread
    connectToServer();
  }, [config?.threadResumable, id]);

  useEffect(() => {
    if (id !== idToResume) {
      return;
    }
    if (session?.error) {
      toast.error("Couldn't resume chat");
      router.push("/");
    }
  }, [session, idToResume, id]);

  useEffect(() => {
    if (resumeThreadError) {
      toast.error("Couldn't resume chat: " + resumeThreadError);
      router.push("/");
      setResumeThreadError(undefined);
    }
  }, [resumeThreadError]);

  return null;
}
