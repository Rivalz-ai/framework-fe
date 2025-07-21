"use client";
import Typography from "@/components/customs/typography";
import { useState } from "react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useConfigurationStore } from "@/stores/use-global-state";

interface ConfigurationXModalProps {
  open: boolean;
  isReplies: boolean;
  onClose: () => void;
}

interface FormState {
  isReplies: boolean;
  tweetCount: string;
  noHashtags: boolean;
  noExclamationMarks: boolean;
  noAllCaps: boolean;
  noEmojis: boolean;
  includeProjectTag: boolean;
  projectTag: string;
  includeProjectTicker: boolean;
  projectTicker: string;
}

export default function ConfigurationXModal({
  open,
  isReplies,
  onClose,
}: ConfigurationXModalProps) {
  const { config, setConfig } = useConfigurationStore();
  const [formData, setFormData] = useState<FormState>({
    isReplies: isReplies,
    tweetCount: config.tweetCount,
    noHashtags: config.noHashtags,
    noExclamationMarks: config.noExclamationMarks,
    noAllCaps: config.noAllCaps,
    noEmojis: config.noEmojis,
    includeProjectTag: config.includeProjectTag,
    projectTag: config.projectTag || "",
    includeProjectTicker: config.includeProjectTicker,
    projectTicker: config.projectTicker || "",
  });
  const handleInputChange = (
    field: keyof FormState,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSaveConfig = () => {
    // Handle save configuration logic here
    console.log("Save configuration:", formData);
    setConfig({ ...formData });
    onClose();
  };
  return (
    <Dialog open={open} modal={true}>
      <DialogContent className="fixed inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative w-full max-w-md space-y-8 bg-[#13161B] p-8 rounded-xl border-none">
          <div className="space-y-2 text-center">
            <Typography.Text variant="l-medium" className="text-white">
              Configuration{" "}
              {isReplies ? "Replies" : "X before you posting tweets"}
            </Typography.Text>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Typography.Text variant="s-regular">
                How many {isReplies ? "replies" : "tweets"} to send out?
              </Typography.Text>
              <Input
                type="number"
                className="text-rivalz-text-primary"
                value={formData.tweetCount}
                onChange={(e) =>
                  handleInputChange("tweetCount", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              {[
                {
                  label: "No hashtags",
                  field: "noHashtags" as keyof FormState,
                },
                {
                  label: "No exclamation marks",
                  field: "noExclamationMarks" as keyof FormState,
                },
                { label: "No all-caps", field: "noAllCaps" as keyof FormState },
                { label: "No emojis", field: "noEmojis" as keyof FormState },
              ].map((item) => (
                <div className="flex items-center gap-1" key={item.field}>
                  <Checkbox
                    id={item.field}
                    checked={formData[item.field] as boolean}
                    onCheckedChange={(checked) =>
                      handleInputChange(item.field, checked as boolean)
                    }
                  />
                  <label htmlFor={item.field}>
                    <Typography.Text variant="s-regular">
                      {item.label}
                    </Typography.Text>
                  </label>
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Checkbox
                    id="includeProjectTag"
                    checked={formData.includeProjectTag}
                    onCheckedChange={(checked) =>
                      handleInputChange("includeProjectTag", checked as boolean)
                    }
                  />
                  <label htmlFor="includeProjectTag">
                    <Typography.Text variant="s-regular">
                      Include project tag
                    </Typography.Text>
                  </label>
                </div>
                {formData.includeProjectTag && (
                  <Input
                    className="text-rivalz-text-primary"
                    value={formData.projectTag}
                    onChange={(e) =>
                      handleInputChange("projectTag", e.target.value)
                    }
                    placeholder="Enter project tag"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Checkbox
                    id="includeProjectTicker"
                    checked={formData.includeProjectTicker}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        "includeProjectTicker",
                        checked as boolean
                      )
                    }
                  />
                  <label htmlFor="includeProjectTicker">
                    <Typography.Text variant="s-regular">
                      Include project ticker
                    </Typography.Text>
                  </label>
                </div>
                {formData.includeProjectTicker && (
                  <Input
                    className="text-rivalz-text-primary"
                    value={formData.projectTicker}
                    onChange={(e) =>
                      handleInputChange("projectTicker", e.target.value)
                    }
                    placeholder="Enter project ticker"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-row gap-2 justify-end">
              <Button variant={"outline"} onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfig}>Save configuration</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
