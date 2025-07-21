import { FileSpec } from "@/types/file-type";
import { useCallback } from "react";
import {
  DropzoneOptions,
  FileRejection,
  FileWithPath,
  useDropzone,
} from "react-dropzone";

interface useUploadProps {
  onError?: (error: string) => void;
  onResolved: (payloads: FileWithPath[]) => void;
  options?: DropzoneOptions;
  spec: FileSpec;
}

const useUpload = ({ onError, onResolved, options, spec }: useUploadProps) => {
  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        if (fileRejections[0].errors[0].code === "file-too-large") {
          onError?.(`File is larger than ${spec.max_size_mb} MB`);
        } else {
          onError?.(fileRejections[0].errors[0].message);
        }
      }

      if (!acceptedFiles.length) return;
      return onResolved(acceptedFiles);
    },
    [spec]
  );

  let dzAccept: Record<string, string[]> = {};
  const accept = spec.accept;

  if (Array.isArray(accept)) {
    accept.forEach((a) => {
      if (typeof a === "string" && a !== "*/*") {  // Ensure valid MIME types
        dzAccept[a] = [];
      }
    });
  } else if (typeof accept === "object") {
    dzAccept = Object.fromEntries(
      Object.entries(accept).filter(([key]) => key !== "*/*")  // Filter out invalid MIME types
    );
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: spec.max_files || undefined,
    accept: dzAccept,
    maxSize: (spec.max_size_mb || 2) * 1000000,
    ...options,
  });

  return { getInputProps, getRootProps, isDragActive };
};

export { useUpload };
