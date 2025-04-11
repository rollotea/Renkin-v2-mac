export class AlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlreadyExistsError"; // カスタムエラー名を設定
  }
}
