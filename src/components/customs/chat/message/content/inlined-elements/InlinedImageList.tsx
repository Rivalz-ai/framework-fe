import { IImageElement } from "@chainlit/react-client";
import { ImageElement } from "@/components/customs/elements/Image";
import { QuiltedGrid } from "@/components/customs/quilted-grid";

interface Props {
  items: IImageElement[];
}

const InlinedImageList = ({ items }: Props) => (
  <QuiltedGrid
    elements={items}
    renderElement={(ctx) => <ImageElement element={ctx.element} />}
  />
);

export { InlinedImageList };
