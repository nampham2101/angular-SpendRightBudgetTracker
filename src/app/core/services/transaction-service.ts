import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, of } from 'rxjs';
import { displayAmountToUsd } from '../constants/fx';
import { readStoredLang } from '../i18n/lang-storage';
import { Transaction } from '../../shared/models/transaction';

export type MoneyDisplayLang = 'en' | 'vi';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private static readonly STORAGE_KEY = 'transactions';
  private static readonly AMOUNT_SCHEMA_KEY = 'spendright_amount_schema';
  private static readonly AMOUNT_SCHEMA_USD = 'usd';

  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.loadTransactions());
  transactions$ = this.transactionsSubject.asObservable();

  private _getNewId(): number {
    const txs = this.transactionsSubject.value;
    return txs.length === 0 ? 1 : Math.max(...txs.map((t) => t.id)) + 1;
  }

  /**
   * Loads transactions; migrates legacy rows once so `amount` is always canonical USD.
   * Legacy = data saved before USD-canonical schema (amounts were in the UI currency at save/switch time).
   */
  private loadTransactions(): Transaction[] {
    const raw = localStorage.getItem(TransactionService.STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      let txs = JSON.parse(raw) as Transaction[];

      if (localStorage.getItem(TransactionService.AMOUNT_SCHEMA_KEY) !== TransactionService.AMOUNT_SCHEMA_USD) {
        const display: MoneyDisplayLang = readStoredLang() === 'vi' ? 'vi' : 'en';
        txs = txs.map((t) => ({
          ...t,
          amount: displayAmountToUsd(t.amount, display),
        }));
        localStorage.setItem(TransactionService.STORAGE_KEY, JSON.stringify(txs));
        localStorage.setItem(TransactionService.AMOUNT_SCHEMA_KEY, TransactionService.AMOUNT_SCHEMA_USD);
      }

      return txs;
    } catch {
      return [];
    }
  }

  private saveTransaction(transactions: Transaction[]) {
    localStorage.setItem(TransactionService.STORAGE_KEY, JSON.stringify(transactions));
  }

  /**
   * @param amountDisplay Amount as entered in the active UI currency (USD if en, whole VND if vi).
   * @param display Which currency the display amount uses.
   */
  addTransaction(amountDisplay: number, notes: string, typeId: number, display: MoneyDisplayLang) {
    const amountUsd = displayAmountToUsd(amountDisplay, display);
    const transaction: Transaction = {
      id: this._getNewId(),
      amount: amountUsd,
      notes: notes,
      typeId: typeId,
      category: '',
      createdDate: Date.now(),
    };

    const next = [...this.transactionsSubject.value, transaction];
    this.transactionsSubject.next(next);
    this.saveTransaction(next);

    return of(transaction).pipe(delay(500));
  }
}
