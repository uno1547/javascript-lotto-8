import LottoManager from "./LottoManager.js";

class App {
  async run() {
    const lottoManager = new LottoManager();
    await lottoManager.getPurchaseAmout();
    lottoManager.generateLottos();
    await lottoManager.getWinNumbers();
    await lottoManager.getBonusNumber();
    lottoManager.getGameResult();
    lottoManager.printGameResult();
  }
}

export default App;