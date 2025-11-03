import { Console, MissionUtils } from "@woowacourse/mission-utils";

class LottoManager {
  constructor() {
    this.lottos = [];
    this.spentMoney = 0;
  }
  
  async getPurchaseAmout() {
    const input = await Console.readLineAsync("구입금액을 입력해 주세요.\n")
    this.spentMoney = parseInt(input, 10);
    Console.print(`입력한 로또금액은 ${input}입니다.`);
  }

  validateSpentMoney() {
    
  }
}
export default LottoManager;