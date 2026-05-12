import { Component } from '@angular/core';
import {TransactionService} from '../../core/services/transaction-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-expense-list',
  imports: [
    AsyncPipe
  ],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  constructor(protected transactionService: TransactionService) {}
}
