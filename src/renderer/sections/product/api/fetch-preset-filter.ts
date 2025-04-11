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
import { FIRESTORE } from "../../../lib/firebase";
import { PresetFilters } from "../../../../main/types/setting/preset-filters";

export const fetchPresetFilter = async (): Promise<PresetFilters> => {
  const sellerRef = doc(FIRESTORE, "filters", "seller");
  const sellerSnap = await getDoc(sellerRef);
  const forbiddenStringRef = doc(FIRESTORE, "filters", "forbidden_string");
  const forbiddenStringSnap = await getDoc(forbiddenStringRef);
  const replacementStringRef = doc(FIRESTORE, "filters", "replacement_string");
  const replacementStringSnap = await getDoc(replacementStringRef);
  if (
    sellerSnap.exists() &&
    forbiddenStringSnap.exists() &&
    replacementStringSnap.exists()
  ) {
    const seller = sellerSnap
      .data()
      .seller.replace(/\s+/g, "")
      .replace(/"/g, "")
      .split(",");
    const forbiddenString = forbiddenStringSnap
      .data()
      .forbidden_string.replace(/\s+/g, "")
      .replace(/"/g, "")
      .split(",");
    const replacementString = replacementStringSnap
      .data()
      .replacement_string.replace(/\s+/g, "");
    // const regex = /\("([^"]+)", ?"([^"]*)"\)/g;
    // const regex = /\(\s*"([^"]+)"\s*,\s*"([^"]*)"\s*\)/g;
    // const regex = /\("([^"]+)",\s*"([^"]*)"\)/g;
    const regex = /\(\s*"([^"]+)"\s*,\s*"([^"]*)"\s*\)/g;
    // const regex = /\("([^"]+)", ?"([^"]*)"\)/g;
    const list: { target: string; value: string | "" }[] = [];
    let match;
    while ((match = regex.exec(replacementString)) !== null) {
      list.push({ target: match[1], value: match[2] || "" });
    }

    // replacementString.match(regex)?.forEach((pair: any) => {
    //   const match = pair.match(/\("([^"]+)", ?"([^"]*)"\)/);
    //   if (match) {
    //     list.push({ target: match[1], value: match[2] || "" });
    //   }
    // });
    return {
      seller: seller,
      forbiddenString: forbiddenString,
      replacementString: list,
    };
  } else {
    throw new Error("failed to fetch preset filters");
  }
};
