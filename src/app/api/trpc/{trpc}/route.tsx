import { appRouter } from "@/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (req: Request) => {
  try {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: () => ({}),
    });
    console.log(`Response: ${response}`);
    return response;
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
};

export { handler as GET, handler as POST };
