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
import { checkUserAvailable } from "../../overview/booking/api/check-user-available";
export const checkExportHistory = async (
  id: string,
  plan: string,
  size: number
) => {
  await checkUserAvailable(id);
  const currentDate = new Date(); // 現在の日時
  const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
  const timestampSevenDaysAgo = Timestamp.fromDate(sevenDaysAgo);

  // コレクションから、`timestamp` フィールドが7日以内のデータを取得
  const usersRef = collection(FIRESTORE, "users", id, "export");
  const q = query(usersRef, where("createdAt", ">=", timestampSevenDaysAgo));
  const result = await getDocs(q);
  // const result = await getDocs(q);
  let count = size;
  result.forEach((data) => {
    count += data.data().quantity;
  });
  if (plan === "Standard" && count >= 3600) {
    throw new Error(
      `You have reached the output limit for the week.\nThe value has gone over the limit by ${
        count - 3600
      }.`
    );
  }
  if (plan === "Plus" && count >= 4800) {
    throw new Error(
      `You have reached the output limit for the week.\nThe value has gone over the limit by ${
        count - 4800
      }.`
    );
  }
};
