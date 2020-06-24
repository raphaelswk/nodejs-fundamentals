import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeBalance = this.transactions.reduce((prev, cur) => {
      return cur.type === 'income' ? prev + cur.value : prev;
    }, 0);
    const outcomeBalance = this.transactions.reduce((prev, cur) => {
      return cur.type === 'outcome' ? prev + cur.value : prev;
    }, 0);
    const totalBalance = incomeBalance - outcomeBalance;

    const balance = {
      income: incomeBalance,
      outcome: outcomeBalance,
      total: totalBalance,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (type === 'outcome') {
      const balance = this.getBalance();
      if (balance.total < value) {
        throw Error('The balance is not enough for the outcome');
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
