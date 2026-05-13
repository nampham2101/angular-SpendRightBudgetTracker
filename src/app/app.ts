import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { LocalePreferenceService } from './core/services/locale-preference';
import { MoneyDisplayLang, TransactionService } from './core/services/transaction-service';
import { ExpenseForm } from './features/expense-form/expense-form';
import { ExpenseList } from './features/expense-list/expense-list';

@Component({
  selector: 'app-root',
  imports: [ExpenseForm, ExpenseList],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('Spend Right - Budget Tracker');
  private readonly transloco = inject(TranslocoService);
  private readonly transactions = inject(TransactionService);
  protected readonly locale = inject(LocalePreferenceService);

  protected setLanguage(lang: string): void {
    const nextLang: MoneyDisplayLang = lang === 'vi' ? 'vi' : 'en';
    const prevLang: MoneyDisplayLang = this.locale.activeLang() === 'vi' ? 'vi' : 'en';

    if (prevLang !== nextLang) {
      this.transactions.convertStoredAmountsForLanguageChange(prevLang, nextLang);
    }

    this.locale.setLang(lang);
    this.transloco.setActiveLang(lang);
  }
}
