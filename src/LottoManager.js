import { Console, MissionUtils } from "@woowacourse/mission-utils";

class LottoManager {
  constructor() {
    this.lottos = [];
    this.spentMoney = 0;
  }
  
  // 깊이가 좀 깊은가?
  async getPurchaseAmout() {
    while (true) {
      const input = await Console.readLineAsync("구입금액을 입력해 주세요.\n")
      try {
        if (!this.validateSpentMoney(input)) throw new Error("[ERROR] 구입 금액은 1000원 단위의 숫자로 입력해 주세요.");
        this.spentMoney = Number(input);
        break;
      } catch (e) {
        Console.print(e.message);
        continue;
      }
    }
  }

  validateSpentMoney(price) {
    const parsedPrice = Number(price);
    return !isNaN(parsedPrice) && parsedPrice % 1000 === 0 && parsedPrice > 0;
  }
}
export default LottoManager;