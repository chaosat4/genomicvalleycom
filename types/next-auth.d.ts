import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      is_admin: boolean;
      is_doctor: boolean;
      is_patient: boolean;
    } & DefaultSession['user']
  }

  interface User {
    is_admin: boolean;
    is_doctor: boolean;
    is_patient: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    is_admin: boolean;
    is_doctor: boolean;
    is_patient: boolean;
  }
}