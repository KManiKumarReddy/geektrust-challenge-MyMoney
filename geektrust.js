const fs = require('fs');
const readline = require('readline');
const MyMoney = require('./MyMoney');

class GeekTrust {
  constructor() {
    this.myMoneyInstance = new MyMoney();
  }

  processCommand(commandString) {
    const args = commandString.split(' ');
    this.myMoneyInstance[(args.shift()).toLowerCase()](...args);
  }

  main(fileName) {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(fileName),
    });

    lineReader.on('line', (line) => {
      this.processCommand(line);
    });
  }
}

const geekTrustObj = new GeekTrust();
geekTrustObj.main(process.argv[2]);
