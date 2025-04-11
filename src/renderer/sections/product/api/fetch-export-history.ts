import {
  getFirestore,
  doc,
  getDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
// import { db } from "../../..";
import { FIRESTORE } from "../../../lib/firebase";

export const fetchExportHistory = async (id: string) => {
  const currentDate = new Date(); // 現在の日時
  const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
  const timestampSevenDaysAgo = Timestamp.fromDate(sevenDaysAgo);

  // コレクションから、`timestamp` フィールドが7日以内のデータを取得
  const usersRef = collection(FIRESTORE, "users", id, "export");
  const q = query(usersRef, where("createdAt", ">=", timestampSevenDaysAgo));
  const result = await getDocs(q);
  // const result = await getDocs(q);
  let count = 0;
  result.forEach((data) => {
    count += data.data().quantity;
  });
  return count;
};
