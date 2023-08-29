export interface ILedgerRepository {
  addRecord(amount: number): Promise<void>;
}

export interface LedgerRecord {
  created: Date;
  amount: number;
}

export class VirtualLedgerRepository implements ILedgerRepository {
  private list: LedgerRecord[];

  constructor() {
    this.list = [];
  }

  public addRecord(amount: number): Promise<void> {
    this.list.push({ created: new Date(), amount });
    return Promise.resolve();
  }
}
