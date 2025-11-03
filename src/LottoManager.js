import { Console, MissionUtils } from "@woowacourse/mission-utils";
import Lotto from "./Lotto.js";

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

  generateLottos() {
    const printNums = this.spentMoney / 1000;
    Console.print(`${printNums}개를 구매했습니다.`);

    for (let i = 0; i < printNums; i++) {
      const combination = MissionUtils.Random.pickUniqueNumbersInRange(1, 45, 6).sort((a, b) => a - b);
      this.lottos.push(new Lotto(combination));
    }
  }

  /*
  printLottos() {
    for (const lotto of this.lottos) {
      // Console.print(`[${lotto.getNumbers().join(", ")}]`);
    }
  }
  */
 
}
export default LottoManager;