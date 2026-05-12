import {Component, computed, ElementRef, signal, viewChild} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {TransactionService} from '../../core/services/transaction-service';
import {EXPENSE_TYPES} from '../../shared/data/expense-types';

@Component({
  selector: 'app-expense-form',
  imports: [
    TranslocoPipe
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
class ExpenseForm {
  amount = signal("");
  rawAmount = signal(0);
  title = signal("Expense");
  notes = signal("");
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

  typeSelect = viewChild<ElementRef<HTMLSelectElement>>('typeSelect')

  constructor(protected transactionService: TransactionService) {
  }

  protected onNotesChanged(event: Event) {
    this.notes.set((event.target as HTMLInputElement).value);
  }

  protected onAmountInput(event: Event) {
    const _amount = (event.target as HTMLInputElement).value;

    const _rawAmount = _amount.replace(/\D/g, '');
    this.rawAmount.set(Number(_rawAmount));

    const localeString = localStorage.getItem('lang') === 'en' ? 'en-US' : 'vi-VN';
    const formattedAmount = this.rawAmount().toLocaleString(localeString);
    this.amount.set(formattedAmount);
  }

  protected save() {
    const typeId = this.typeSelect()?.nativeElement.value;

    this.transactionService.addTransaction(
      this.rawAmount(),
      this.notes().trim(),
      Number(typeId)
    ).subscribe({
      next: () => {
        this.amount.set("");
        this.rawAmount.set(0);
        this.notes.set("");
      },
      error: err => {
        console.error('Error adding transaction', err);
      }
    });
  }
}

export default ExpenseForm
