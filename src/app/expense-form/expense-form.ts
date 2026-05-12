import {Component, computed, signal} from '@angular/core';
import {ExpenseType} from '../expense-type';
import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  selector: 'app-expense-form',
  imports: [
    TranslocoPipe
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm {
  private readonly EXPENSE_TYPES: ExpenseType[] = [
    {
      id: 0,
      name: "None",
      selected: true,
      keywords: []
    },
    {
      id: 1,
      name: "Chi tieu",
      selected: true,
      keywords: [
        "mua", "an"
      ]
    },
    {
      id: 2,
      name: "Khan cap",
      selected: true,
      keywords: [
        "benh", "vien", "thuoc"
      ]
    }
  ];
  amount = signal(0);
  title = signal("Expense");
  notes = signal("");
  expenseTypes = computed(() => {
    const newNotes = this.notes().trim();

    if (!newNotes) {
      return this.EXPENSE_TYPES.map(type => ({...type, selected: false}));
    }

    const keywordSet = new Set(newNotes.split(" "));
    return this.EXPENSE_TYPES.map(type => ({
      ...type,
      selected: type.keywords.some(keyword => keywordSet.has(keyword))
    }));
  });

  protected onNotesChanged(event: Event) {
    this.notes.set((event.target as HTMLInputElement).value);
  }
}
