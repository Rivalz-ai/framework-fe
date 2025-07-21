import { FileSpec, useConfig } from "@chainlit/react-client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UploadButtonProps {
  disabled?: boolean;
  fileSpec: FileSpec;
  onFileUpload: (files: File[]) => void;
  onFileUploadError: (error: string) => void;
}

export const UploadButton = ({
  disabled = false,
  fileSpec,
  onFileUpload,
  onFileUploadError,
}: UploadButtonProps) => {
  const { config } = useConfig();

  if (!config?.features.spontaneous_file_upload?.enabled) return null;

  return <div></div>;
};

export default UploadButton;
