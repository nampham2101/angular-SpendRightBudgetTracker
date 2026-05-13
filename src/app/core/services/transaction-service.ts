import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, of } from 'rxjs';
import { USD_TO_VND_RATE } from '../constants/fx';
import { Transaction } from '../../shared/models/transaction';

export type MoneyDisplayLang = 'en' | 'vi';

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

  /**
   * Amounts in storage are always in the active display currency (USD when lang is en, VND when vi).
   * Rewrites all rows when the user switches language so values stay equivalent at the fixed rate.
   */
  convertStoredAmountsForLanguageChange(from: MoneyDisplayLang, to: MoneyDisplayLang): void {
    if (from === to) {
      return;
    }

    const txs = this.transactionsSubject.value;
    if (txs.length === 0) {
      return;
    }

    const rate = USD_TO_VND_RATE;
    const next = txs.map((t) => {
      let amount = t.amount;
      if (from === 'vi' && to === 'en') {
        amount = Math.round((t.amount / rate) * 100) / 100;
      } else if (from === 'en' && to === 'vi') {
        amount = Math.round(t.amount * rate);
      }
      return { ...t, amount };
    });

    this.transactionsSubject.next(next);
    this.saveTransaction(next);
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
