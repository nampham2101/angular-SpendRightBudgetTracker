import { Component, signal } from '@angular/core';
import {ExpenseForm} from './expense-form/expense-form';

@Component({
  selector: 'app-root',
  imports: [
    ExpenseForm
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Spend Right - Budget Tracker');
}
