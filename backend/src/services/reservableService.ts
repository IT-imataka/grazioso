import { Reservable } from "../types/models";
import reservableRepositories, {
  ReservableRepository,
} from "../repositories/reservableRepositories";
import { error } from "node:console";

// データ型の用意
type CreateReservableRequset = {
  // id: string;
  name: string;
  sex: "MAN" | "WOMAN";
  isActive: boolean;
};

// controllerに渡せるような状態に db経由による非同期処理
export class ReservableService {
  private repository: ReservableRepository;

  constructor() {
    this.repository = new ReservableRepository();
  }
  // 作成
  async CreateReservale(
    data: CreateReservableRequset,
  ): Promise<Omit<Reservable, "id">> {
    // repoからの取り出し
    const allReservables = await reservableRepositories.findAll();
    // 重複チェック
    // for (const being of allReservables) {
    //   if (being.id !== data.id) {
    //     continue;
    //   }
    //   if (being) {
    //     throw new Error("既に設定されています");
    //   }
    // }
    // idは同様に日付で採番
    // const newId = crypto.randomUUID();
    const newReservables: Omit<Reservable, "id"> = {
      // id: newId,
      name: data.name,
      sex: data.sex,
      isActive: data.isActive,
    };
    // 保存
    await reservableRepositories.create(newReservables);
    // await this.repository.create(newReservables);
    // 返す
    return newReservables;
  }

  // 取得
  async getAllreservable(): Promise<Reservable[]> {
    // 返す
    return await reservableRepositories.findAll();
  }

  // 削除
  async DeleteReservable(id: string): Promise<boolean> {
    // 削除
    const del = await reservableRepositories.delete(id);
    // 返す
    return del;
  }

  // 更新
  async UpdateReservable(
    id: number,
    name: string,
    sex: "MAN" | "WOMAN",
    isActive: boolean,
  ): Promise<Reservable> {
    // updateは更新後のデータを用意する

    const newData: Partial<Reservable> = {
      id: id,
      name: name,
      sex: sex,
      isActive: isActive,
    };

    // 更新
    const updated = await reservableRepositories.update(id, newData);
    // 更新内容の確認
    if (!updated) {
      console.error("更新項目が見つかりません", error);
      throw new Error("更新項目がありません");
    }
    // 返す
    return updated;
  }
}
export default new ReservableService();
