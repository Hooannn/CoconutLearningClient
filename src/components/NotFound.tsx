import { Button, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function NotFound(props: { text?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-4 h-full w-full">
      <Image src="/8401.jpg" className="w-2/5 mx-auto" />
      <small className="text-muted-foreground">
        {props.text ?? "Not found."}
      </small>
      <Button onClick={() => navigate("/")} color="primary" className="mt-2">
        Back to Home
      </Button>
    </div>
  );
}
