import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TransactionService } from '../../core/services/transaction-service';
import { LocalePreferenceService } from '../../core/services/locale-preference';
import { EXPENSE_TYPES } from '../../shared/data/expense-types';
import { BlockTitle } from '../../shared/components/block-title/block-title';
import { Label } from '../../shared/components/label/label';

@Component({
  selector: 'app-expense-form',
  imports: [TranslocoPipe, BlockTitle, Label],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseForm {
  private readonly locale = inject(LocalePreferenceService);

  /** Stable list for help copy (names + descriptions); select uses `expenseTypes()` with keyword state. */
  protected readonly jars = EXPENSE_TYPES;

  rawAmount = signal(0);
  title = signal('Expense');
  notes = signal('');

  displayAmount = computed(() => {
    const n = this.rawAmount();
    if (n === 0) {
      return '';
    }
    return n.toLocaleString(this.locale.numberLocale());
  });

  expenseTypes = computed(() => {
    const newNotes = this.notes().trim();

    if (!newNotes) {
      return EXPENSE_TYPES.map(type => ({...type, selected: false}));
    }

    const keywordSet = new Set(newNotes.split(" "));
    return EXPENSE_TYPES.map(type => ({
      ...type,
      selected: type.keywords.some(keyword => keywordSet.has(keyword))
    }));
  });

  typeSelect = viewChild<ElementRef<HTMLSelectElement>>('typeSelect');

  protected transactionService = inject(TransactionService);

  protected onNotesChanged(event: Event) {
    this.notes.set((event.target as HTMLInputElement).value);
  }

  protected onAmountInput(event: Event) {
    const _amount = (event.target as HTMLInputElement).value;

    const _rawAmount = _amount.replace(/\D/g, '');
    this.rawAmount.set(Number(_rawAmount));
  }

  protected save() {
    const typeId = this.typeSelect()?.nativeElement.value;

    this.transactionService.addTransaction(
      this.rawAmount(),
      this.notes().trim(),
      Number(typeId)
    ).subscribe({
      next: () => {
        this.rawAmount.set(0);
        this.notes.set('');
      },
      error: err => {
        console.error('Error adding transaction', err);
      }
    });
  }
}
