export type UserType = Record<string, any> | null;
// import { FirebaseUser } from "../../main/types/user";

export type AuthState = {
  // user: FirebaseUser | null;
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  // user: FirebaseUser | null;
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
