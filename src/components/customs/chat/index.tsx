"use client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  currentThreadIdState,
  threadHistoryState,
  useAuth,
  useChatData,
  useChatInteract,
  useChatMessages,
  useConfig,
} from "@chainlit/react-client";

import { IAttachment, attachmentsState } from "@/state/chat";

import ChatFooter from "./footer";
import Alert from "../alert";
import ErrorBoundary from "../error-boundary";
import MessagesContainer from "./messages-container";
import ScrollContainer from "./scroll-container";
import { useUpload } from "@/hooks/use-upload";
import { useRouter } from "next/navigation";
import { Loader } from "../loader";

const Chat = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { config } = useConfig();
  const setAttachments = useSetRecoilState(attachmentsState);
  const setThreads = useSetRecoilState(threadHistoryState);
  const setCurrentThreadId = useSetRecoilState(currentThreadIdState);
  const autoScrollRef = useRef(true);
  const { error, disabled, callFn, loading } = useChatData();
  const { uploadFile } = useChatInteract();
  const uploadFileRef = useRef(uploadFile);

  const fileSpec = useMemo(
    () => ({
      max_size_mb:
        config?.features?.spontaneous_file_upload?.max_size_mb || 500,
      max_files: config?.features?.spontaneous_file_upload?.max_files || 20,
      accept: config?.features?.spontaneous_file_upload?.accept || {
        "application/*": [], // All application files
        "audio/*": [], // All audio files
        "image/*": [], // All image files
        "text/*": [], // All text files
        "video/*": [], // All video files
      },
    }),
    [config]
  );

  useEffect(() => {
    if (callFn) {
      const event = new CustomEvent("chainlit-call-fn", {
        detail: callFn,
      });
      window.dispatchEvent(event);
    }
  }, [callFn]);

  useEffect(() => {
    uploadFileRef.current = uploadFile;
  }, [uploadFile]);

  const onFileUpload = useCallback(
    (payloads: File[]) => {
      const attachements: IAttachment[] = payloads.map((file) => {
        const id = uuidv4();

        const { xhr, promise } = uploadFileRef.current(file, (progress) => {
          setAttachments((prev) =>
            prev.map((attachment) => {
              if (attachment.id === id) {
                return {
                  ...attachment,
                  uploadProgress: progress,
                };
              }
              return attachment;
            })
          );
        });

        promise
          .then((res) => {
            setAttachments((prev) =>
              prev.map((attachment) => {
                if (attachment.id === id) {
                  return {
                    ...attachment,
                    // Update with the server ID
                    serverId: res.id,
                    uploaded: true,
                    uploadProgress: 100,
                    cancel: undefined,
                  };
                }
                return attachment;
              })
            );
          })
          .catch((error) => {
            toast.error(
              `Failed ${file.name}: ${
                typeof error === "object" && error !== null
                  ? (error.message ?? error)
                  : error
              }`
            );
            setAttachments((prev) =>
              prev.filter((attachment) => attachment.id !== id)
            );
          });

        return {
          id,
          type: file.type,
          name: file.name,
          size: file.size,
          uploadProgress: 0,
          cancel: () => {
            toast.info(`Cancelled ${file.name}`);
            xhr.abort();
            setAttachments((prev) =>
              prev.filter((attachment) => attachment.id !== id)
            );
          },
          remove: () => {
            setAttachments((prev) =>
              prev.filter((attachment) => attachment.id !== id)
            );
          },
        };
      });
      setAttachments((prev) => prev.concat(attachements));
    },
    [uploadFile]
  );

  const onFileUploadError = useCallback(
    (error: string) => toast.error(error),
    [toast]
  );

  const upload = useUpload({
    spec: fileSpec,
    onResolved: onFileUpload,
    onError: onFileUploadError,
    options: { noClick: true },
  });

  const { threadId } = useChatMessages();

  useEffect(() => {
    const currentPage = new URL(window.location.href);
    if (!threadId) {
      setThreads((prev) => ({
        ...prev,
        currentThreadId: undefined,
      }));
      setCurrentThreadId(undefined);
      return;
    }

    // if (user && config?.dataPersistence && currentPage.pathname === "/") {
    //   router.push(`/thread/${threadId}`);
    // } else {
    // }
    setThreads((prev) => ({
      ...prev,
      currentThreadId: threadId,
    }));

    setCurrentThreadId(threadId);
  }, [threadId, user, config?.dataPersistence, router]);

  const enableAttachments =
    !disabled && config?.features?.spontaneous_file_upload?.enabled;

  return (
    <div
      {...(enableAttachments
        ? upload.getRootProps({ className: "dropzone" })
        : {})}
      onBlur={undefined}
      onFocus={undefined}
      className="flex justify-center items-center w-full flex-col h-full"
    >
      {enableAttachments ? (
        <input id="#upload-drop-input" {...upload.getInputProps()} />
      ) : null}

      {error ? (
        <div className="w-full mx-auto my-2">
          <Alert className="mx-2" id="session-error" variant="error">
            serverConnection
          </Alert>
        </div>
      ) : null}
      <ErrorBoundary>
        <ScrollContainer
          autoScrollUserMessage={config?.features?.user_message_autoscroll}
          autoScrollRef={autoScrollRef}
        >
          <div
            className="flex flex-col mx-auto w-full flex-grow scrollbar-thin scrollbar-thumb-[#373A40] scrollbar-track-transparent "
            style={
              {
                // maxWidth: layoutMaxWidth,
              }
            }
          >
            {/* <WelcomeScreen
              fileSpec={fileSpec}
              onFileUpload={onFileUpload}
              onFileUploadError={onFileUploadError}
              autoScrollRef={autoScrollRef}
            /> */}
            <MessagesContainer navigate={(to: string) => router.push(to)} />
            {loading && (
              <div className="flex flex-grow items-start justify-start">
                <Loader className="!size-6" />
              </div>
            )}
          </div>
        </ScrollContainer>
        <div className="flex flex-col mx-auto w-full pt-0 ">
          <ChatFooter
            fileSpec={fileSpec}
            onFileUpload={onFileUpload}
            onFileUploadError={onFileUploadError}
            autoScrollRef={autoScrollRef}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Chat;
