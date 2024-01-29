import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  User,
  Divider,
  Link,
  Spinner,
} from "@nextui-org/react";
import { AiOutlineUser } from "react-icons/ai";
import dayjs from "../../libs/dayjs";
import { useNavigate } from "react-router-dom";
import { Classroom } from "../../types/classroom";
import { Assignment, Classwork, IResponseData } from "../../types";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery } from "@tanstack/react-query";
export default function ScoresTab(props: {
  classroom: Classroom;
  isOwner: boolean;
  isProvider: boolean;
}) {
  const axios = useAxiosIns();
  const getClassworksQuery = useQuery({
    queryKey: ["fetch/classworks/exam/classroom", props.classroom.id],
    queryFn: () =>
      axios.get<IResponseData<Classwork[]>>(
        `/api/v1/classwork/${props.classroom.id}/exam`
      ),
    refetchOnWindowFocus: false,
  });

  const classworks = getClassworksQuery.data?.data?.data || [];
  const columns = [
    {
      id: "STUDENT",
      title: "Student",
    } as Classwork,
    ...classworks,
  ];
  const rows = props.classroom.users.map((user) => ({
    id: user.id,
    STUDENT: user,
    ...classworks.reduce((acc, cur) => {
      acc[cur.id] = cur.assignments?.find((a) => a.author.id === user.id);
      return acc;
    }, {} as { [key: string]: Assignment | undefined }),
  })) as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }[];
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {getClassworksQuery.isLoading ? (
        <div className="w-full h-24 flex items-center justify-center">
          <Spinner size="lg"></Spinner>
        </div>
      ) : (
        <Table
          aria-label="Example static collection table"
          shadow="none"
          className="p-0"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.id}>
                {column.id === "STUDENT" ? (
                  <div>{column.title}</div>
                ) : (
                  <div className="flex flex-col">
                    <div>
                      {column.deadline
                        ? dayjs(column.deadline).format("MMMM D, YYYY")
                        : "No deadline"}
                    </div>
                    <Link
                      onClick={() => {
                        navigate(
                          `/classroom/${props.classroom.id}/classwork/${column.id}?tab=student_assignments`
                        );
                      }}
                    >
                      {column.title}
                    </Link>
                    <Divider className="my-2" />
                    <div className="font-normal">out of {column.score}</div>
                  </div>
                )}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "STUDENT" ? (
                      <User
                        name={
                          item.STUDENT?.first_name +
                          " " +
                          item.STUDENT?.last_name
                        }
                        avatarProps={{
                          src: item.STUDENT?.avatar_url,
                          fallback: (
                            <AiOutlineUser
                              className="w-6 h-6 text-default-500"
                              fill="currentColor"
                              size={20}
                            />
                          ),
                          showFallback: true,
                          className: "w-8 h-8",
                        }}
                      />
                    ) : (
                      <>
                        {item[columnKey.toString()] ? (
                          item[columnKey]?.grade?.grade ? (
                            item[columnKey]?.grade?.grade
                          ) : (
                            <span className="text-xs">Submitted</span>
                          )
                        ) : (
                          <span className="text-xs">
                            Not submitted or not assigned
                          </span>
                        )}
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
