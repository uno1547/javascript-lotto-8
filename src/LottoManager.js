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
  static result = {
    "1등": 0,
    "2등": 0,
    "3등": 0,
    "4등": 0,
    "5등": 0,
    "winningPrice": 0,
  }
  
  constructor() {
    this.lottos = [];
    this.spentMoney = 0;
    this.winNumbers = null;
    this.bonusNumber = null;
    this.result = { ...LottoManager.result };
    this.winningRate = 0
  }
  
  // 깊이가 좀 깊은가?
  // 구입 금액 입력 받기
  async getPurchaseAmout() {
    while (true) {
      const input = await Console.readLineAsync("구입금액을 입력해 주세요.\n")
      try {
        this.validateSpentMoney(input);
        this.spentMoney = Number(input);
        break;
      } catch (e) {
        Console.print(e.message);
        continue;
      }
    }
  }

  // 구입 금액 유효성 검사
  validateSpentMoney(price) {
    const parsedPrice = Number(price);
    if (!Number.isInteger(parsedPrice) || parsedPrice % 1000 !== 0 || parsedPrice <= 0) throw new Error("[ERROR] 구입 금액은 1000원 단위의 숫자로 입력해 주세요.");
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
        this.validateWinNumbers(input);
        this.winNumbers = input.split(",").map(Number);
        break;
      } catch (e) {
        Console.print(e.message);
        continue;
      }
    }
  }

  // 당첨 번호 유효성 검사
  validateWinNumbers(numbers) {
    const numTokens = numbers.split(",").map(Number);
    const isLengthValid = numTokens.length === 6;
    if (!isLengthValid) throw new Error("[ERROR] 당첨 번호는 6개여야 합니다.");

    const isAllinRange = numTokens.every(num => Number.isInteger(num) && num >= 1 && num <= 45);
    if (!isAllinRange) throw new Error("[ERROR] 로또 번호는 1부터 45 사이의 숫자여야 합니다.");

    const isNotDuplicated = new Set(numTokens).size === numTokens.length;
    if (!isNotDuplicated) throw new Error("[ERROR] 당첨 번호는 중복될 수 없습니다.");
  }

  // 보너스 번호 입력 받기
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

  // 보너스 번호 유효성 검사
  validateBonusNumber(number) {
    const num = Number(number);

    if (!Number.isInteger(num)) throw new Error("[ERROR] 보너스 번호는 정수여야 합니다.");
    if (num < 1 || num > 45) throw new Error("[ERROR] 보너스 번호는 1~45 사이여야 합니다.");
    if (this.winNumbers.includes(num)) throw new Error("[ERROR] 보너스 번호는 기존 당첨 번호와 중복될 수 없습니다.");
  }

  // 게임 결과 계산
  getGameResult() {
    // 최종적으로 몇게임이 몇등인지 알아야함
    for(let i = 0; i < this.lottos.length; i++) {
      const curLotto = this.lottos[i];
      this.getLottoResult(curLotto); // 한 로또의 결과 계산
    }
    this.getPriceResult();
  }

  // 한 로또의 결과 계산
  getLottoResult(lotto) {
    const lottoNumbers = lotto.getNumbers();
    let matchCount = 0;
    let isBonusMatched = false;

    for (let number of lottoNumbers) {
      if (this.winNumbers.includes(number)) matchCount++;
      if (number === this.bonusNumber) isBonusMatched = true;
    }
    this.updateResult(matchCount, isBonusMatched);
  }

  // 결과 업데이트
  updateResult(matchCount, isBonusMatched) {
    const rankMap = {
      6: "1등",
      5: isBonusMatched ? "2등" : "3등",
      4: "4등",
      3: "5등"
    };

    const rank = rankMap[matchCount];
    if (!rank) return; // 낙첨

    this.result[rank]++;
  }


  // 상금 결과 계산
  getPriceResult() {
    const entries = Object.entries(this.result); // [ ["1등", 0], ["2등", 2], ...]
    const totalPrice = entries.reduce((acc, [key, value]) => {
      if (key === "winningPrice") return acc;
      acc += LottoManager.winningPriceMap[key] * value;
      return acc;
    }, 0)

    this.result.winningPrice = Number(totalPrice);
    this.winningRate = (totalPrice / this.spentMoney) * 100;
  }

  // 게임 결과 출력
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
}
export default LottoManager;