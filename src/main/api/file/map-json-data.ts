import { Input } from "../../types/input";
export function MapJsonData(input: any) {
  const typedJsonData: Input[] = input.map((item: any) => ({
    // カテゴリ名: item.カテゴリ名 === undefined ? null : item.カテゴリ名,
    // ブランド名称: item.ブランド名称 === undefined ? null : item.ブランド名称,
    // 商品コード: item.商品コード === undefined ? null : item.商品コード,
    // 品番: item.品番 === undefined ? null : item.品番,
    // 外箱_W: item.外箱_W === undefined ? null : item.外箱_W,
    // 外箱_D: item.外箱_D === undefined ? null : item.外箱_D,
    // 外箱_H: item.外箱_H === undefined ? null : item.外箱_H,
    // 外箱_重量: item.外箱_重量 === undefined ? null : item.外箱_重量,
    // Amazon_ASIN: item.Amazon_ASIN === undefined ? null : item.Amazon_ASIN,
    // 価格COM名: item.価格COM名 === undefined ? null : item.価格COM名,
    // メーカー商品ページ:
    //   item.メーカー商品ページ === undefined ? null : item.メーカー商品ページ,
    カテゴリ名: item.カテゴリ名,
    ブランド名称: item.ブランド名称,
    商品コード: item.商品コード,
    品番: item.品番,
    外箱_W: item.外箱_W,
    外箱_D: item.外箱_D,
    外箱_H: item.外箱_H,
    外箱_重量: item.外箱_重量,
    Amazon_ASIN: item.Amazon_ASIN,
    価格COM名: item.価格COM名,
    メーカー商品ページ: item.メーカー商品ページ,
  }));
  return typedJsonData;
}
