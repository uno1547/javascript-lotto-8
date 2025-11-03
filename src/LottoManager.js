import { Console, MissionUtils } from "@woowacourse/mission-utils";
import Lotto from "./Lotto.js";

class LottoManager {

  static winningPriceMap = {
    "1등": 2000000000,
    "2등": 30000000,
    "3등": 1500000,
    "4등": 50000,
    "5등": 5000
  }

  constructor() {
    this.lottos = [];
    this.spentMoney = 0;
    this.winNumbers = null;
    this.bonusNumber = null;
    this.result = {
      "1등": 0,
      "2등": 0,
      "3등": 0,
      "4등": 0,
      "5등": 0,
      "winningPrice": 0,
    }
    this.winningRate = 0
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
    if (this.winNumbers.includes(num)) throw new Error("[ERROR] 보너스 번호는 기존 당첨 번호와 중복될 수 없습니다.");
  }

  getGameResult() {
    // 최종적으로 몇게임이 몇등인지 알아야함
    for(let i = 0; i < this.lottos.length; i++) {
      const curLotto = this.lottos[i];
      this.getLottoResult(curLotto);
    }
    Console.print(this.result)
    this.getPriceResult();
    // Console.print(this.lottos[0].getNumbers());
  }

  getLottoResult(lotto) {
    const lottoNumbers = lotto.getNumbers();
    let matchCount = 0;
    let isBonusMatched = false;

    for (let number of lottoNumbers) {
      if (this.winNumbers.includes(number)) matchCount++;
      if (number === this.bonusNumber) isBonusMatched = true;
    }
    Console.print(`일치하는 번호 개수: ${matchCount}, 보너스 번호 일치: ${isBonusMatched}`);
    this.updateResult(matchCount, isBonusMatched);
  }

  updateResult(matchCount, isBonusMatched) {
    Console.print(`Updating result for matchCount: ${matchCount}, isBonusMatched: ${isBonusMatched}`);
    switch (Number(matchCount)) {
      case 6:
        Console.print(`1등 당첨!`);
        this.result["1등"]++;
        break;
      case 5:
        if (isBonusMatched) {
          Console.print(`2등 당첨!`); 
          this.result["2등"]++;
        } else {
          Console.print(`3등 당첨!`);
          this.result["3등"]++;
        }
        break;
      case 4:
        Console.print(`4등 당첨!`);
        this.result["4등"]++;
        break;
      case 3:
        Console.print(`5등 당첨!`);
        this.result["5등"]++;
        break;
      default:
        break;
    }
  }


  getPriceResult() {
    const entries = Object.entries(this.result); // [ ["1등", 0], ["2등", 2], ...]
    const totalPrice = entries.reduce((acc, [key, value]) => {
      if (key === "winningPrice") return acc;
      Console.print(`key: ${key}, value: ${value}`);
      Console.print(`winningPriceMap[key]: ${LottoManager.winningPriceMap[key]}`);
      acc += LottoManager.winningPriceMap[key] * value;
      return acc;
    }, 0)

    this.result.winningPrice = Number(totalPrice);
    this.winningRate = (totalPrice / this.spentMoney) * 100;
    Console.print(`총 당첨 금액은 ${totalPrice}원 입니다.`);
  }

  printGameResult() {
    Console.print("당첨 통계");
    Console.print("---");
    Console.print(`3개 일치 (5,000원) - ${this.result["5등"]}개`);
    Console.print(`4개 일치 (50,000원) - ${this.result["4등"]}개`);
    Console.print(`5개 일치 (1,500,000원) - ${this.result["3등"]}개`);
    Console.print(`5개 일치, 보너스 볼 일치 (30,000,000원) - ${this.result["2등"]}개`);
    Console.print(`6개 일치 (2,000,000,000원) - ${this.result["1등"]}개`);
    Console.print(`총 수익률은 ${this.winningRate.toFixed(2)}%입니다.`);
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