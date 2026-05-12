import { Component, signal } from '@angular/core';
import {ExpenseForm} from './expense-form/expense-form';
import {ExpenseList} from './expense-list/expense-list';

@Component({
  selector: 'app-root',
  imports: [
    ExpenseForm,
    ExpenseList
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Spend Right - Budget Tracker');
}
