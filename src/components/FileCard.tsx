import { File } from "../types";
export default function FileCard(props: { file: File }) {
  const fileHost = import.meta.env.VITE_FILE_HOST;
  const fileUrl = `${fileHost}/${props.file.id}`;

  return <div>{fileUrl}</div>;
}
