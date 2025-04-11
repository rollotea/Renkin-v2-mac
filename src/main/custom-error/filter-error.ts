export class FilterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FilterError"; // カスタムエラー名を設定
  }
}
