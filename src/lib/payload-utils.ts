import { User } from "../payload-types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import payload from "payload";

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  console.log("Server URL:", process.env.NEXT_PUBLIC_SERVER_URL);

  const token =
    cookies.get("payload-token")?.value || cookies.get("_vercel_jwt")?.value;
  console.log(
    "cookies.get(_vercel_jwt)?.value: ",
    cookies.get("_vercel_jwt")?.value
  );
    console.log("cookies: ", cookies);
  console.log("cookies ALL: ", cookies.getAll());
  if (!token) {
    console.error("No token found in cookies");
    return { user: null };
  }
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  if (!meRes.ok) {
    console.error("Failed to fetch user:", meRes.statusText);
    return { user: null };
  }
  const { user } = (await meRes.json()) as {
    user: User | null;
  };

  return { user };
};
