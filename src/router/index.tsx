import rootRouter from "./RootRouter";
import authRouter from "./AuthRouter";
import { createBrowserRouter } from "react-router-dom";

const getRouter = () => createBrowserRouter([...rootRouter, ...authRouter]);

export default getRouter;
