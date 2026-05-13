import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, of } from 'rxjs';
import { Transaction } from '../../shared/models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private static readonly STORAGE_KEY = 'transactions';
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.loadTransactions());
  transactions$ = this.transactionsSubject.asObservable();

  private _getNewId(): number {
    const txs = this.transactionsSubject.value;
    return txs.length === 0 ? 1 : Math.max(...txs.map((t) => t.id)) + 1;
  }

  private loadTransactions(): Transaction[] {
    const raw = localStorage.getItem(TransactionService.STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Transaction[];
    } catch {
      return [];
    }
  }

  private saveTransaction(transactions: Transaction[]) {
    localStorage.setItem(TransactionService.STORAGE_KEY, JSON.stringify(transactions));
  }

  addTransaction(amount: number, notes: string, typeId: number) {
    const transaction: Transaction = {
      id: this._getNewId(),
      amount: amount,
      notes: notes,
      typeId: typeId,
      category: '',
      createdDate: Date.now()
    };

    const next = [...this.transactionsSubject.value, transaction];
    this.transactionsSubject.next(next);
    this.saveTransaction(next);

    return of(transaction).pipe(delay(500));
  }
}
