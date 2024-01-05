import { PropsWithChildren } from "react";
import useClassrooms from "./services/classroom";
import Loading from "./components/Loading";

export default function Global(props: PropsWithChildren) {
  const { isLoading } = useClassrooms();
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-dvh w-dvw bg-white">
          <Loading></Loading>
        </div>
      ) : (
        props.children
      )}
    </>
  );
}
