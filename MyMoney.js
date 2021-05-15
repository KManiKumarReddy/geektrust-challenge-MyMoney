class MyMoney {
  constructor() {
    this.months = {
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
    this.balances = [];
    this.mix = {};
    this.sip = {};
  }

  allocate(equity, debt, gold) {
    this.balances = [{ equity: Number(equity), debt: Number(debt), gold: Number(gold) }];
    const total = this.balances[0].equity
    + this.balances[0].debt
    + this.balances[0].gold;
    this.mix = {
      equity: this.balances[0].equity / total,
      debt: this.balances[0].debt / total,
      gold: this.balances[0].gold / total,
    };
  }

  sip(equity, debt, gold) {
    this.sip = { equity: Number(equity), debt: Number(debt), gold: Number(gold) };
  }

  balancePortfolioMix() {
    this.balances.pop();
    const currentBalance = this.balances.pop();
    // balance portfolio
    const total = currentBalance.equity + currentBalance.debt + currentBalance.gold;
    Object.keys(currentBalance).forEach(
      (commodity) => {
        currentBalance[commodity] = Math.floor(this.mix[commodity] * total);
      },
    );

    // save to database
    this.balances.push(currentBalance);
    const nextMonth = {};
    Object.keys(currentBalance).forEach(
      (commodity) => {
        nextMonth[commodity] = currentBalance[commodity] + this.sip[commodity];
      },
    );
    this.balances.push(nextMonth);
  }

  change(equity, debt, gold, month) {
    const percentageChange = { equity, debt, gold };
    Object.keys(percentageChange).forEach(
      (commodity) => {
        percentageChange[commodity] = parseInt(percentageChange[commodity]
          .replace('%', '')
          .replace('.', ''),
        10) + 10000;
      },
    );

    const amounts = this.balances[this.months[month]];

    // calculate change in portfolio
    Object.keys(amounts).forEach(
      (commodity) => {
        amounts[commodity] = Math.floor((amounts[commodity] * percentageChange[commodity]) / 10000);
      },
    );

    // rebalance on june and december
    if (month === 'JUNE' || month === 'DECEMBER') {
      this.balances.push('');
      this.balancePortfolioMix();
      return;
    }

    // add SIP and add next month
    const nextMonth = {};
    Object.keys(amounts).forEach(
      (commodity) => {
        nextMonth[commodity] = amounts[commodity] + this.sip[commodity];
      },
    );
    this.balances.push(nextMonth);
  }

  balance(month) {
    const currentBalance = this.balances[this.months[month]];
    process.stdout.write(`${currentBalance.equity} ${currentBalance.debt} ${currentBalance.gold} \n`);
  }

  rebalance() {
    const balancesLength = this.balances.length;
    if (balancesLength > 12) {
      const currentBalance = this.balances[11];
      process.stdout.write(`${currentBalance.equity} ${currentBalance.debt} ${currentBalance.gold} \n`);
    } else if (balancesLength > 6) {
      const currentBalance = this.balances[5];
      process.stdout.write(`${currentBalance.equity} ${currentBalance.debt} ${currentBalance.gold} \n`);
    } else {
      process.stdout.write('CANNOT_REBALANCE\n');
    }
  }
}

module.exports = MyMoney;
