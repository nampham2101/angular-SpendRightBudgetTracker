import { Component } from '@angular/core';
import {TransactionService} from '../../core/services/transaction-service';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import {TranslocoPipe} from '@jsverse/transloco';
import {map, Observable} from 'rxjs';
import {Transaction} from '../../shared/models/transaction';
import {EXPENSE_TYPES} from '../../shared/data/expense-types';
import {BlockTitle} from '../../shared/components/block-title/block-title';

@Component({
  selector: 'app-expense-list',
  imports: [
    AsyncPipe,
    TranslocoPipe,
    DatePipe,
    CurrencyPipe,
    BlockTitle
  ],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  transactions$: Observable<Transaction[]>;
  constructor(protected transactionService: TransactionService) {
    this.transactions$ = this.transactionService.transactions$.pipe(
      map(transactions => {
        return [...transactions].map(transaction => {

          const category = EXPENSE_TYPES.find(category => category.id === transaction.typeId)
          transaction.category = category ? category.name : 'Unknown';
          return transaction;
        }).sort((a,b) => b.createdDate - a.createdDate);
      })
    )
  }

  protected getCurrentCode() {
    return localStorage.getItem('lang') === 'vi' ? 'VND' : 'USD';
  }

  protected getCurrentLocal() {
    return localStorage.getItem('lang') === 'vi' ? 'vi-VN' : 'en-US';
  }
}
