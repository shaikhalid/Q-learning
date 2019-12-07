export default class Qtable {
    constructor()   {
        this.qTable = [];
    }

    fillQtable() {
        for (let i = 0; i < 16; i++) {
          for (let j = 0; j < 20; j++) {
            let subQtable = [];
            for (let i = 0; i < 16; i++) {
              for (let j = 0; j < 20; j++) {
                subQtable.push([
                  Math.random(),
                  Math.random(),
                  Math.random(),
                  Math.random(),
                  Math.random()
                ]);
              }
            }
            this.qTable.push(subQtable);
          }
        }
        console.log(this.qTable);
      }
}