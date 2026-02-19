import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    status?: string;
    organizationId?: string;
  }

  interface Session {
    user: User & {
      role?: string;
      status?: string;
      organizationId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    status?: string;
    organizationId?: string;
  }
}
