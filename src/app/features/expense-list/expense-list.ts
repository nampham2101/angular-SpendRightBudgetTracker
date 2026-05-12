import { Component } from '@angular/core';
import {TransactionService} from '../../core/services/transaction-service';
import {AsyncPipe} from '@angular/common';
import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  selector: 'app-expense-list',
  imports: [
    AsyncPipe,
    TranslocoPipe
  ],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  constructor(protected transactionService: TransactionService) {}
}
