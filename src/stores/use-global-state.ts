import { ISwarm } from "@/types/swarms-type";
import { atom, useAtom } from "jotai";

interface InitialState {
  swarmSelected: ISwarm;
}

const modalGlobalState = atom<InitialState>({
  swarmSelected: {
    project_id: "",
    project_name: "",
    status: "",
    unique_name: "",
    logo: "/mock-avatar.png",
  },
});
const configXState = atom({
  isReplies: true,
  tweetCount: "",
  noHashtags: false,
  noExclamationMarks: false,
  noAllCaps: false,
  noEmojis: false,
  includeProjectTag: false,
  projectTag: "",
  includeProjectTicker: false,
  projectTicker: "",
});
export const useConfigurationStore = () => {
  const [config, setConfig] = useAtom(configXState);
  return { config, setConfig };
};
export const useGlobalStore = () => useAtom(modalGlobalState);
