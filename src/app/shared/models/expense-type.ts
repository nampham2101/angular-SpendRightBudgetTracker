export interface ExpenseType {
  id: number;
  /** Transloco key for the jar title, e.g. `jar.nec.name`. */
  nameKey: string;
  /** Transloco key for a short explanation of the jar, e.g. `jar.nec.description`. */
  descriptionKey: string;
  selected: boolean;
  keywords: string[];
}
