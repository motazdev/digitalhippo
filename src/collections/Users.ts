import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify Account</a>`;
      },
    },
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "role",
      required: true,
      defaultValue: "user",
      // admin: {
      //   // only admin user can see this field
      //   // condition: ({ req }) => req.user.role === "admin",
      //   condition: () => false,
      // },
      type: "select",
      options: [
        {
          label: "Admin", // user will read
          value: "admin", // not readable (for us only)
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
  ],
};
