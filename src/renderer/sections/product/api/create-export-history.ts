import {
  getFirestore,
  doc,
  getDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
} from "firebase/firestore";
// import { db } from "../../..";
import { FIRESTORE } from "../../../lib/firebase";

export const createExportHistory = async (id: string, size: number) => {
  const usersRef = collection(FIRESTORE, "users", id, "export");
  setDoc(doc(usersRef), {
    quantity: size,
    createdAt: Timestamp.now(),
  });
};
