import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Tooltip,
} from "@nextui-org/react";
import { Classroom } from "../types/classroom";
import { IoMdFolderOpen } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuUserSquare2 } from "react-icons/lu";
import useAuthStore from "../stores/auth";
import { useNavigate } from "react-router-dom";

export default function ClassroomCard(props: { classroom: Classroom }) {
  const { user } = useAuthStore();
  const isTeaching =
    props.classroom.providers.some((p) => p.id === user?.id) ||
    props.classroom.owner.id === user?.id;

  const navigate = useNavigate();
  return (
    <Card
      className="w-72"
      shadow="sm"
      isPressable
      onPress={() => navigate(`/classroom/${props.classroom.id}`)}
    >
      <CardBody className="overflow-visible p-0">
        <Image
          radius="lg"
          width="100%"
          alt={"Banana"}
          className="w-full object-cover h-[100px] z-1"
          src={props.classroom.coverImageUrl}
        />
        <div className="flex items-center justify-end mt-[-32px] mr-[16px] z-10">
          <Avatar
            className="w-16 h-16"
            fallback={
              <AiOutlineUser
                className="w-6 h-6 text-default-500"
                fill="currentColor"
                size={20}
              />
            }
            showFallback
            src={props.classroom.owner.avatar_url}
          />
        </div>
      </CardBody>
      <CardFooter className="flex flex-col gap-2 items-start">
        <div className="w-full hover:underline transition">
          <Tooltip content={props.classroom.name}>
            <p className="text-lg font-medium text-start truncate">
              {props.classroom.name}
            </p>
          </Tooltip>

          <Tooltip content={props.classroom.description}>
            <p className="text-small text-start truncate text-muted-foreground font-thin">
              {props.classroom.description}
            </p>
          </Tooltip>
        </div>
        <Divider></Divider>
        <div className="flex items-center justify-end w-full">
          {isTeaching ? (
            <Tooltip content="Open scores">
              <Button isIconOnly variant="light">
                <FaArrowTrendUp className="w-4 h-4" />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content="Open classwork">
              <Button isIconOnly variant="light">
                <LuUserSquare2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          )}

          <Tooltip content="Open folder">
            <Button isIconOnly variant="light">
              <IoMdFolderOpen className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
}
