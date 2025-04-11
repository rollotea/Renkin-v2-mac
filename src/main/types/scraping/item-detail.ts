import {
  ReplacementString,
  ReplacementStringRow,
} from "../setting/replacement-string";

export type ItemDetail = {
  url: string;
  sku: string;
  name: string;
  price: string;
  seller: string;
  main: string;
  sub_1: string | null;
  sub_2: string | null;
  sub_3: string | null;
  sub_4: string | null;
  sub_5: string | null;
  sub_6: string | null;
  sub_7: string | null;
  sub_8: string | null;
  description: string;
};

export type ItemDetailRow = {
  id: string;
  url: string;
  sku: string;
  name: string;
  price: string;
  seller: string;
  main: string;
  sub_1: string | null;
  sub_2: string | null;
  sub_3: string | null;
  sub_4: string | null;
  sub_5: string | null;
  sub_6: string | null;
  sub_7: string | null;
  sub_8: string | null;
  description: string;
  createdAt: string;
};

export type MappedPrice = {
  beforeMap: number;
  afterMap: number;
};
export type Filter = {
  ForbiddenSeller: string | null;
  ForbiddenStrings: string[];
  ReplacementPairs: ReplacementString[];
  // ReplacementPairs: ReplacementStringRow[];
  MappedPrice: MappedPrice | null;
};
export const initialFilter: Filter = {
  ForbiddenSeller: null,
  ForbiddenStrings: [],
  ReplacementPairs: [],
  MappedPrice: null,
};
export type DisplayItemDetailRow = {
  id: string;
  url: string;
  sku: string;
  name: string;
  price: string;
  seller: string;
  main: string;
  sub_1: string | null;
  sub_2: string | null;
  sub_3: string | null;
  sub_4: string | null;
  sub_5: string | null;
  sub_6: string | null;
  sub_7: string | null;
  sub_8: string | null;
  description: string;
  createdAt: string;
  isValid: boolean;
  filter: Filter;
};
