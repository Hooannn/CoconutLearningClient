import { Button, Card, CardBody, Divider, User } from "@nextui-org/react";
import { Classroom } from "../../types/classroom";
import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import { FaEllipsisVertical } from "react-icons/fa6";
import InviteModal, { InviteType } from "./InviteModal";
import { useState } from "react";

export default function MembersTab(props: {
  classroom: Classroom;
  isOwner: boolean;
  isProvider: boolean;
}) {
  const [shouldShowInviteModal, setShowInviteModal] = useState(false);
  const [inviteType, setInviteType] = useState<InviteType>(InviteType.USER);
  return (
    <>
      <InviteModal
        isOpen={shouldShowInviteModal}
        onClose={() => setShowInviteModal(false)}
        type={inviteType}
      />
      <div className="py-4 px-2 flex flex-col gap-2 items-center max-w-[980px] mx-auto">
        <Card shadow="sm" className="w-full">
          <CardBody>
            <div className="py-2 flex items-center justify-between">
              <div className="text-lg font-bold text-primary">Providers</div>
              {props.isOwner && (
                <Button
                  onClick={() => {
                    setInviteType(InviteType.PROVIDER);
                    setShowInviteModal(true);
                  }}
                  isIconOnly
                  radius="full"
                  color="primary"
                  variant="light"
                >
                  <AiOutlineUserAdd size={24} />
                </Button>
              )}
            </div>
            <Divider />
            <div className="flex flex-col gap-2 py-2">
              {[props.classroom.owner, ...props.classroom.providers].map(
                (provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between"
                  >
                    <User
                      name={provider.fullName}
                      description={provider.email}
                      avatarProps={{
                        src: provider.avatar_url,
                        fallback: (
                          <AiOutlineUser
                            className="w-6 h-6 text-default-500"
                            fill="currentColor"
                            size={20}
                          />
                        ),
                        showFallback: true,
                        className: "w-12 h-12",
                      }}
                    />
                    {props.isOwner &&
                      props.classroom.owner.id !== provider.id && (
                        <Button radius="full" isIconOnly variant="light">
                          <FaEllipsisVertical size={16} />
                        </Button>
                      )}
                  </div>
                )
              )}
            </div>
          </CardBody>
        </Card>
        {props.classroom.users.length > 0 && (
          <Card shadow="sm" className="w-full">
            <CardBody>
              <div className="py-2 flex items-center justify-between">
                <div className="text-lg font-bold text-primary">Students</div>
                {props.isOwner && (
                  <Button
                    onClick={() => {
                      setInviteType(InviteType.USER);
                      setShowInviteModal(true);
                    }}
                    isIconOnly
                    radius="full"
                    color="primary"
                    variant="light"
                  >
                    <AiOutlineUserAdd size={24} />
                  </Button>
                )}
              </div>
              <Divider />
              <div className="flex flex-col gap-2 py-2">
                {props.classroom.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <User
                      name={user.fullName}
                      description={user.email}
                      avatarProps={{
                        src: user.avatar_url,
                        fallback: (
                          <AiOutlineUser
                            className="w-6 h-6 text-default-500"
                            fill="currentColor"
                            size={20}
                          />
                        ),
                        showFallback: true,
                        className: "w-12 h-12",
                      }}
                    />
                    {props.isOwner && (
                      <Button radius="full" isIconOnly variant="light">
                        <FaEllipsisVertical size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}
