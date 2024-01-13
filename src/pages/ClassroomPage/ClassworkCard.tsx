import ReactQuill from "react-quill";
import { Classwork } from "../../types";
import { Classroom } from "../../types/classroom";
import dayjs from "../../libs/dayjs";
import FileCard from "../../components/FileCard";
import { Button, Divider } from "@nextui-org/react";

export default function ClassworkCard(props: {
  classwork: Classwork;
  classroom: Classroom;
  isProvider: boolean;
}) {
  return (
    <div>
      <div className="text-sm opacity-60 pb-3">
        Published {dayjs(props.classwork.created_at).fromNow()}
      </div>
      {props.classwork.description!.length > 0 && (
        <div className="pb-3">
          <ReactQuill
            className="readonly"
            value={props.classwork.description}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "code-block",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
            ]}
            readOnly={true}
            theme={"snow"}
            modules={{ toolbar: false }}
          ></ReactQuill>
        </div>
      )}
      {props.classwork.files.length > 0 && (
        <div className="w-full flex items-center flex-wrap gap-4 mt-3">
          {props.classwork.files.map((file, index) => (
            <FileCard
              showCloseButton={false}
              file={file}
              isSelected={false}
              key={file.id + index}
            />
          ))}
        </div>
      )}
      <Divider />
      <div className="pt-2">
        <Button color="primary" variant="light">
          See details
        </Button>
      </div>
    </div>
  );
}
