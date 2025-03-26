import lib from "@overextended/ox_lib/client"

export class MiniGame {

  async doMiniGame(data:any): Promise<boolean> {
    return await lib.skillCheck(data.difficulty, data.inputs);
  }
}
