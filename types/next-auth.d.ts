import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      isDoctor: boolean;
      isPatient: boolean;
    } & DefaultSession['user']
  }

  interface User {
    isAdmin: boolean;
    isDoctor: boolean;
    isPatient: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
    isDoctor: boolean;
    isPatient: boolean;
  }
}