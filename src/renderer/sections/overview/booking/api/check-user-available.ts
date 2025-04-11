import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../..";
import { FIRESTORE } from "../../../../lib/firebase";
export const checkUserAvailable = async (uid: string) => {
  const docRef = doc(FIRESTORE, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (docSnap.data().available === false) {
      throw new Error("This account is not available!");
    }
  } else {
    throw new Error("Invalid account");
  }
};
