import { Page } from "puppeteer";
import { timeout } from "../api/timeout";

export async function getImageLink(page: Page) {
  await page.waitForSelector(
    "div div.slick-slider.slick-initialized > div > div > div.slick-slide.slick-active.slick-current > div > button > img",
    timeout
  );
  // const description = await element?.evaluate((el) => el.textContent);

  const elements = await page.$$(
    "div div.slick-slider.slick-initialized > div > div > div.slick-slide.slick-active.slick-current > div > button > img"
  );
  if (elements.length > 0) {
    const data = await Promise.all(
      elements.map((el) => page.evaluate((el) => el.src, el))
    );
    return {
      main: data[0],
      sub_1: data[1] || null,
      sub_2: data[2] || null,
      sub_3: data[3] || null,
      sub_4: data[4] || null,
      sub_5: data[5] || null,
      sub_6: data[6] || null,
      sub_7: data[7] || null,
      sub_8: data[8] || null,
    };
  } else {
    throw new Error("商品画像の取得に失敗しました");
  }
}
