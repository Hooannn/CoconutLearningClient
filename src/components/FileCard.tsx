import { Image, Tooltip } from "@nextui-org/react";
import { File } from "../types";
import { AiOutlineCloseCircle, AiOutlineFile } from "react-icons/ai";

export default function FileCard(props: {
  file: File;
  isSelected: boolean;
  showCloseButton: boolean;
  onClose?: (file: File) => void;
  onClick?: (file: File) => void;
}) {
  const fileHost = import.meta.env.VITE_FILE_HOST;
  const fileUrl = `${fileHost}/${props.file.id}`;

  const renderPreview = () => {
    if (props.file.content_type.startsWith("image/")) {
      return (
        <div className="flex flex-col w-full h-full overflow-hidden items-center justify-center text-center">
          <Image
            className="h-[60px]"
            removeWrapper
            src={fileUrl}
            alt={props.file.name}
          />
          <small className="truncate w-full mt-1">
            <strong>{props.file.name}</strong>
            <div>{props.file.content_type}</div>
          </small>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col w-full h-full overflow-hidden items-center justify-center text-center">
          <AiOutlineFile size={48} className="text-gray-500" />
          <small className="truncate w-full mt-1">
            <strong>{props.file.name}</strong>
            <div className="text-xs">{props.file.content_type}</div>
          </small>
        </div>
      );
    }
  };
  return (
    <Tooltip content={props.file.name}>
      <div
        onDoubleClick={() => {
          window.open(fileUrl, "_blank");
        }}
        onClick={() => props.onClick?.(props.file)}
        className={`${
          props.isSelected ? "border-primary border text-primary" : ""
        } relative w-[120px] h-[120px] p-2 flex items-center justify-center transition hover:bg-gray-100 rounded-lg cursor-pointer`}
      >
        {renderPreview()}

        {props.showCloseButton && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              props.onClose?.(props.file);
            }}
            className="absolute top-0 right-0 z-10 w-4 h-4 bg-white rounded-full"
          >
            <AiOutlineCloseCircle size={20} />
          </div>
        )}
      </div>
    </Tooltip>
  );
}
