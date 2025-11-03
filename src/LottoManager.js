import { Console, MissionUtils } from "@woowacourse/mission-utils";

class LottoManager {
  constructor() {
    this.lottos = [];
    this.spentMoney = 0;
  }
  
  async getPurchaseAmout() {
    const input = await Console.readLineAsync("구입금액을 입력해 주세요.\n")
    // if(!this.validateSpentMoney(input)) new Error("[ERROR] 올바른 금액을 입력해 주세요.");
    if(!this.validateSpentMoney(input)) {
      Console.print("[ERROR] 올바른 금액을 입력해 주세요.");
      this.getPurchaseAmout();
      return;
    }
    this.spentMoney = parseInt(input, 10);
    Console.print(`입력한 로또금액은 ${input}입니다.`);
  }
  validateSpentMoney(price) {
    // if(!Number(price)) Console.print("숫자로 입력해주세요")
    // if(Number(price) % 1000 != 0) Console.print("1000원단위로")
    return Number(price) && Number(price) % 1000 === 0;
    // return Number(price) % 1000 === 0 && Number(price) > 0;
  }
}
export default LottoManager;