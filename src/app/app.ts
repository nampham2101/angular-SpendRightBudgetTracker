import {Component, signal} from '@angular/core';
import {ExpenseForm} from './expense-form/expense-form';
import {ExpenseList} from './expense-list/expense-list';
import {TranslocoService} from '@jsverse/transloco';

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
  language = signal("");

  constructor(private transloco: TranslocoService) {
    this.language.set(localStorage.getItem('lang') || 'en');
  }

  protected setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.transloco.setActiveLang(lang);
  }
}
