import { FirebaseUser } from "../../../../main/types/user";
import { UserCredential } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export const createNewData = (
  userCredential: UserCredential,
  firstName: string,
  lastName: string,
  email: string
) => {
  return {
    id: userCredential.user.uid,
    firstName: firstName,
    lastName: lastName,
    email: userCredential.user.email || email,
    plan: "Standard",
    available: true,
    createdAt: userCredential.user.metadata.creationTime
      ? Timestamp.fromDate(new Date(userCredential.user.metadata.creationTime))
      : Timestamp.now(),
  };
};
