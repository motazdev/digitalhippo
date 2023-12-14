"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return "<a href='".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token, "'>Verify Account</a>");
            },
        },
    },
    access: {
        read: function () { return true; },
        create: function () { return true; },
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
