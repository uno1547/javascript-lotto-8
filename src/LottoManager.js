import { Console, MissionUtils } from "@woowacourse/mission-utils";
import Lotto from "./Lotto.js";

class LottoManager {
  constructor() {
    this.lottos = [];
    this.spentMoney = 0;
    this.winNumbers = null;
    this.bonusNumber = null;
  }
  
  // 깊이가 좀 깊은가?
  async getPurchaseAmout() {
    while (true) {
      const input = await Console.readLineAsync("구입금액을 입력해 주세요.\n")
      try {
        if (!this.validateSpentMoney(input)) throw new Error("[ERROR] 구입 금액은 1000원 단위의 숫자로 입력해 주세요.");
        // 여기서 if 쓰지말고, 그냥 validateSpentMoney에서 에러 던지기해도 잡힐것같은데? 
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
    return Number.isInteger(parsedPrice) && parsedPrice % 1000 === 0 && parsedPrice > 0;
  }

  // 로또 생성
  generateLottos() {
    const printNums = this.spentMoney / 1000;
    Console.print(`${printNums}개를 구매했습니다.`);

    for (let i = 0; i < printNums; i++) {
      const combination = MissionUtils.Random.pickUniqueNumbersInRange(1, 45, 6).sort((a, b) => a - b);
      this.lottos.push(new Lotto(combination));
    }
  }
  // 당첨 번호 입력 받기
  async getWinNumbers() {
    while (true) {
      const input = await Console.readLineAsync("당첨 번호를 입력해 주세요.\n")
      try {
        // const numbers = input.split(",").map(Number)
        this.validateWinNumbers(input);
        this.winNumbers = input.split(",").map(Number);
        break;
      } catch (e) {
        Console.print(e.message);
        continue;
      }
    }
  }

  validateWinNumbers(numbers) {
    const numTokens = numbers.split(",").map(Number);
    const isLengthValid = numTokens.length === 6;
    if (!isLengthValid) throw new Error("[ERROR] 당첨 번호는 6개여야 합니다.");

    const isAllinRange = numTokens.every(num => Number.isInteger(num) && num >= 1 && num <= 45);
    if (!isAllinRange) throw new Error("[ERROR] 로또 번호는 1부터 45 사이의 숫자여야 합니다.");
    // if () throw new Error("[ERROR] 당첨 번호는 중복될 수 없습니다.");

    const isNotDuplicated = new Set(numTokens).size === numTokens.length;
    if (!isNotDuplicated) throw new Error("[ERROR] 당첨 번호는 중복될 수 없습니다.");
  }

  async getBonusNumber() {
    while (true) {
      const input = await Console.readLineAsync("보너스 번호를 입력해 주세요.\n")
      try {
        this.validateBonusNumber(input);
        this.bonusNumber = Number(input);
        break;
      } catch (e) {
        Console.print(e.message);
        continue;
      }
    }
  }

  validateBonusNumber(number) {
    const num = Number(number);

    if (!Number.isInteger(num)) throw new Error("[ERROR] 보너스 번호는 정수여야 합니다.");
    if (num < 1 || num > 45) throw new Error("[ERROR] 보너스 번호는 1~45 사이여야 합니다.");
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