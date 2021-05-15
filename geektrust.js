const fs = require('fs');
const readline = require('readline');
const myMoney = require('./myMoney');

const GeekTrust = () => {
  const database = {};
  const processCommand = (commandString) => {
    const args = commandString.split(' ');
    myMoney[(args.shift()).toLowerCase()](database, ...args);
  };

  const main = (fileName) => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(fileName),
    });

    lineReader.on('line', (line) => {
      processCommand(line);
    });
  };
  const fileName = process.argv[2];
  main(fileName);
};

GeekTrust();
