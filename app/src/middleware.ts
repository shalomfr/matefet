import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // next-auth מטפל בהפניה אוטומטית
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (path.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }
        if (path.startsWith("/portal")) {
          return token?.role === "MANAGER" && token?.status === "APPROVED";
        }
        return true;
      },
    },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
