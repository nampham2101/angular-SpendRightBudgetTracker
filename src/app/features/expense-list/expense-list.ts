import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { map, Observable } from 'rxjs';
import { LocalePreferenceService } from '../../core/services/locale-preference';
import { TransactionService } from '../../core/services/transaction-service';
import { BlockTitle } from '../../shared/components/block-title/block-title';
import { EXPENSE_TYPES } from '../../shared/data/expense-types';
import { Transaction } from '../../shared/models/transaction';

@Component({
  selector: 'app-expense-list',
  imports: [AsyncPipe, TranslocoPipe, DatePipe, CurrencyPipe, BlockTitle],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseList {
  protected readonly locale = inject(LocalePreferenceService);
  protected readonly transactionService = inject(TransactionService);

  /** VND: whole units; USD: up to two fraction digits. */
  protected readonly amountDigitsInfo = computed(() =>
    this.locale.activeLang() === 'vi' ? '1.0-0' : '1.2-2',
  );

  readonly transactions$: Observable<Transaction[]> = this.transactionService.transactions$.pipe(
    map((transactions) =>
      [...transactions]
        .map((transaction) => {
          const match = EXPENSE_TYPES.find((t) => t.id === transaction.typeId);
          return {
            ...transaction,
            categoryKey: match ? match.nameKey : 'jar.unknown',
          };
        })
        .sort((a, b) => b.createdDate - a.createdDate),
    ),
  );
}
