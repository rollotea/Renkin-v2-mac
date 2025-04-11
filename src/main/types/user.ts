import { Timestamp } from "firebase/firestore";

export type Export = {
  quantity: number;
  createdAt: Timestamp;
};

export type FirebaseUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  export: Export | null;
  plan: "Standard" | "Plus" | "Unlimited";
  available: boolean;
  createdAt: Timestamp;
};
