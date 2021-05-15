const months = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,
};

const allocate = (database, equity, debt, gold) => {
  const data = database;
  data.balances = [{ equity: Number(equity), debt: Number(debt), gold: Number(gold) }];
  const total = data.balances[0].equity + data.balances[0].debt + data.balances[0].gold;
  data.mix = {
    equity: data.balances[0].equity / total,
    debt: data.balances[0].debt / total,
    gold: data.balances[0].gold / total,
  };
};

const sip = (database, equity, debt, gold) => {
  const data = database;
  data.sip = { equity: Number(equity), debt: Number(debt), gold: Number(gold) };
};

const balancePortfolioMix = (database) => {
  const data = database;
  data.balances.pop();
  const currentBalance = data.balances.pop();
  // balance portfolio
  const total = currentBalance.equity + currentBalance.debt + currentBalance.gold;
  Object.keys(currentBalance).forEach(
    (commodity) => {
      currentBalance[commodity] = Math.floor(data.mix[commodity] * total);
    },
  );

  // save to database
  data.balances.push(currentBalance);
  const nextMonth = {};
  Object.keys(currentBalance).forEach(
    (commodity) => {
      nextMonth[commodity] = currentBalance[commodity] + data.sip[commodity];
    },
  );
  data.balances.push(nextMonth);
};

const change = (database, equity, debt, gold, month) => {
  const data = database;
  const percentageChange = { equity, debt, gold };
  Object.keys(percentageChange).forEach(
    (commodity) => {
      percentageChange[commodity] = parseInt(percentageChange[commodity]
        .replace('%', '')
        .replace('.', ''),
      10) + 10000;
    },
  );

  const amounts = data.balances[months[month]];

  // calculate change in portfolio
  Object.keys(amounts).forEach(
    (commodity) => {
      amounts[commodity] = Math.floor((amounts[commodity] * percentageChange[commodity]) / 10000);
    },
  );

  // rebalance on june and december
  if (month === 'JUNE' || month === 'DECEMBER') {
    data.balances.push('');
    balancePortfolioMix(database);
    return;
  }

  // add SIP and add next month
  const nextMonth = {};
  Object.keys(amounts).forEach(
    (commodity) => {
      nextMonth[commodity] = amounts[commodity] + data.sip[commodity];
    },
  );
  data.balances.push(nextMonth);
};

const balance = (database, month) => {
  const currentBalance = database.balances[months[month]];
  process.stdout.write(`${currentBalance.equity} ${currentBalance.debt} ${currentBalance.gold} \n`);
};

const rebalance = (database) => {
  const balancesLength = database.balances.length;
  if (balancesLength > 12) {
    const currentBalance = database.balances[11];
    process.stdout.write(`${currentBalance.equity} ${currentBalance.debt} ${currentBalance.gold} \n`);
  } else if (balancesLength > 6) {
    const currentBalance = database.balances[5];
    process.stdout.write(`${currentBalance.equity} ${currentBalance.debt} ${currentBalance.gold} \n`);
  } else {
    process.stdout.write('CANNOT_REBALANCE\n');
  }
};

module.exports = {
  allocate,
  sip,
  change,
  balance,
  rebalance,
};
