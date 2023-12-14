import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from ".";

// the frontend now know just the type of the backend
export const trpc = createTRPCReact<AppRouter>({});
