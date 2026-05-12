import {ExpenseType} from '../models/expense-type';

export const EXPENSE_TYPES: ExpenseType[] = [
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
