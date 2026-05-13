import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { LocalePreferenceService } from './core/services/locale-preference';
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
  protected readonly locale = inject(LocalePreferenceService);

  protected setLanguage(lang: string): void {
    this.locale.setLang(lang);
    this.transloco.setActiveLang(lang);
  }
}
