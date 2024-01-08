import {
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  User,
} from "@nextui-org/react";
import { Post } from "../../types";
import useAuthStore from "../../stores/auth";
import { AiOutlineUser, AiOutlineSend } from "react-icons/ai";
import dayjs from "../../libs/dayjs";
import { FaEllipsisVertical } from "react-icons/fa6";
import ReactQuill from "react-quill";
export default function PostCard(props: { post: Post }) {
  const { user } = useAuthStore();
  const author = props.post.author;
  const isOwner = author.id === user?.id;
  return (
    <Card shadow="sm">
      <CardBody className="items-start">
        <div className="flex items-center justify-between w-full">
          <User
            name={author?.first_name + " " + author?.last_name}
            description={dayjs(props.post.created_at).fromNow()}
            avatarProps={{
              src: author?.avatar_url,
              fallback: (
                <AiOutlineUser
                  className="w-6 h-6 text-default-500"
                  fill="currentColor"
                  size={20}
                />
              ),
              showFallback: true,
            }}
          />
          {isOwner && (
            <Dropdown placement="left-end">
              <DropdownTrigger>
                <Button radius="full" isIconOnly variant="light">
                  <FaEllipsisVertical size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Post action" variant="flat">
                <DropdownItem
                  onClick={() => {}}
                  className="py-2"
                  key="edit_post"
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  color="danger"
                  onClick={() => {}}
                  className="py-2"
                  key="delete_post"
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        <ReactQuill
          className="readonly"
          value={props.post.body}
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
        <Divider />
        <div className="flex items-center space-between w-full gap-2 pt-4">
          <Avatar
            src={user?.avatar_url}
            fallback={
              <AiOutlineUser
                className="w-6 h-6 text-default-500"
                fill="currentColor"
                size={20}
              />
            }
            showFallback
            className="w-10 h-10"
          ></Avatar>
          <Input
            radius="full"
            placeholder="Add comment to class..."
            size="sm"
            variant="bordered"
            color="primary"
          />
          <Button isIconOnly radius="full" color="primary" variant="light">
            <AiOutlineSend size={24} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
