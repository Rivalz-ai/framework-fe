import { IVideoElement } from "@chainlit/react-client";
import { VideoElement } from "@/components/customs/elements/Video";

interface Props {
  items: IVideoElement[];
}

const InlinedVideoList = ({ items }: Props) => (
  <div className="flex flex-col gap-2">
    {items.map((i) => (
      <VideoElement key={i.id} element={i} />
    ))}
  </div>
);

export { InlinedVideoList };
