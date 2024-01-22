import { Accordion, AccordionItem, Button, Image } from "@nextui-org/react";
import useClassroomStore from "../../stores/classroom";
import ClassroomCard from "../../components/ClassroomCard";
import JoinClassroomModal from "../../components/JoinClassroomModal";
import { useState } from "react";
import CreateClassroomModal from "../../components/CreateClassroomModal";

export default function DashboardPage() {
  const { registeredClassrooms, teachingClassrooms } = useClassroomStore();
  const [shouldJoinModalOpen, setJoinModalOpen] = useState(false);
  const [shouldCreateModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div className="py-4 px-2">
      <JoinClassroomModal
        isOpen={shouldJoinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
      <CreateClassroomModal
        isOpen={shouldCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      {registeredClassrooms.length === 0 && teachingClassrooms.length === 0 ? (
        <div className="w-full h-[50vh] flex flex-col gap-4 items-center justify-center">
          <Image src="/empty_states_home.svg" width={170} removeWrapper />
          <div className="opacity-70">
            <small>Add a class to get started</small>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setCreateModalOpen(true)}
              color="primary"
              variant="light"
              className="w-28"
            >
              Create class
            </Button>
            <Button
              onClick={() => setJoinModalOpen(true)}
              color="primary"
              className="w-28"
            >
              Join class
            </Button>
          </div>
        </div>
      ) : (
        <Accordion
          defaultExpandedKeys={["1", "2"]}
          selectionMode="multiple"
          variant="splitted"
        >
          <AccordionItem key="1" aria-label="Teaching" title="Teaching">
            {teachingClassrooms.length > 0 ? (
              <div className="flex flex-wrap gap-4 px-1 pb-4">
                {teachingClassrooms.map((classroom) => (
                  <ClassroomCard key={classroom.id} classroom={classroom} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 h-full w-full">
                <Image width={250} src="/e1.jpg" />
                <small>
                  It seem that you haven't teaching any classrooms now.
                </small>
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  variant="flat"
                  className="my-2"
                  color="primary"
                >
                  Create a class now
                </Button>
              </div>
            )}
          </AccordionItem>
          <AccordionItem key="2" aria-label="Registered" title="Registered">
            {registeredClassrooms.length > 0 ? (
              <div className="flex flex-wrap gap-4 px-1 pb-4">
                {registeredClassrooms.map((classroom) => (
                  <ClassroomCard key={classroom.id} classroom={classroom} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 h-full w-full">
                <Image width={300} src="/e2.jpg" />
                <small>
                  It seem that you haven't registered any classrooms now.
                </small>
                <Button
                  onClick={() => setJoinModalOpen(true)}
                  variant="flat"
                  className="my-2"
                  color="primary"
                >
                  Join a class now
                </Button>
              </div>
            )}
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
