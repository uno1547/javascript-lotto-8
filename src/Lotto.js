import { Console } from "@woowacourse/mission-utils";

class Lotto {
  #numbers;

  constructor(numbers) {
    this.#validate(numbers);
    this.#numbers = numbers;
    Console.print(this.#numbers);
    // 구매한 로또 번호 출력은 누구 책임인가?
  }

  #validate(numbers) {
    if (numbers.length !== 6) {
      throw new Error("[ERROR] 로또 번호는 6개여야 합니다.");
    }
  }

  // TODO: 추가 기능 구현
  /*
  getNumbers() {
    return this.#numbers;
  }
  */
}

export default Lotto;
