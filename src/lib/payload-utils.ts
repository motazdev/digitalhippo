import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import payload from "payload";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const token = cookies.get("payload-token")?.value;
  console.log("cookies: ", cookies);
  console.log("cookies ALL: ", cookies.getAll());
  console.log("payload.authenticate: ", payload.authenticate);
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );

  const { user } = (await meRes.json()) as {
    user: User | null;
  };

  return { user };
};
