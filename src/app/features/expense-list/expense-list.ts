import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocalePreferenceService } from '../../core/services/locale-preference';
import { TransactionService } from '../../core/services/transaction-service';
import { usdToVndMinor } from '../../core/constants/fx';
import { BlockTitle } from '../../shared/components/block-title/block-title';
import { EXPENSE_TYPES } from '../../shared/data/expense-types';
import { Transaction } from '../../shared/models/transaction';

type TransactionRow = Transaction & { categoryKey: string; displayAmount: number };

@Component({
  selector: 'app-expense-list',
  imports: [TranslocoPipe, DatePipe, CurrencyPipe, BlockTitle],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseList {
  protected readonly locale = inject(LocalePreferenceService);
  private readonly transactionService = inject(TransactionService);

  private readonly txs = toSignal(this.transactionService.transactions$, {
    initialValue: [] as Transaction[],
  });

  /** VND: whole units; USD: up to two fraction digits. */
  protected readonly amountDigitsInfo = computed(() =>
    this.locale.activeLang() === 'vi' ? '1.0-0' : '1.2-2',
  );

  /** Rows for the template: category keys + display currency amount (no full-array rewrite on lang change). */
  readonly displayRows = computed((): TransactionRow[] => {
    const isVi = this.locale.activeLang() === 'vi';
    return [...this.txs()]
      .map((transaction) => {
        const match = EXPENSE_TYPES.find((t) => t.id === transaction.typeId);
        return {
          ...transaction,
          categoryKey: match ? match.nameKey : 'jar.unknown',
          displayAmount: isVi ? usdToVndMinor(transaction.amount) : transaction.amount,
        };
      })
      .sort((a, b) => b.createdDate - a.createdDate);
  });
}
