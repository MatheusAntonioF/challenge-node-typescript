import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'outcome' | 'income';
}

interface Totals {
  [key: string]: number;
}

interface ReponseGetAll {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): ReponseGetAll {
    return { transactions: this.transactions, balance: this.getBalance() };
  }

  public getBalance(): Balance {
    const types = ['income', 'outcome'];

    const totals: Totals = {};

    types.forEach(defaultType => {
      totals[defaultType] = this.transactions.reduce((total, currentValue) => {
        if (currentValue.type === defaultType)
          return total + currentValue.value;
        return total;
      }, 0);
    });

    const balance = this.transactions.reduce((total, currentValue) => {
      if (currentValue.type === 'income') return total + currentValue.value;
      return total - currentValue.value;
    }, 0);

    return { income: totals.income, outcome: totals.outcome, total: balance };
  }

  public create({ title, type, value }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, type, value });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
