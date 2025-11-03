import { Console, MissionUtils } from "@woowacourse/mission-utils";
import Lotto from "./Lotto.js";
import LottoManager from "./LottoManager.js";

class App {
  async run() {
    const lottoManager = new LottoManager();
    await lottoManager.getPurchaseAmout();
    // Console.print("계산이 완료되었습니다.");
    lottoManager.generateLottos();

    await lottoManager.getWinNumbers();

    await lottoManager.getBonusNumber();

    

  }
}

export default App;