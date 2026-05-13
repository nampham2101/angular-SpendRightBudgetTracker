export interface Transaction {
  id: number;
  amount: number;
  notes: string;
  typeId: number;
  /** Legacy field from storage; list UI prefers `categoryKey` + Transloco. */
  category: string;
  /** Transloco key for the jar name when projecting rows in the history list. */
  categoryKey?: string;
  createdDate: number;
}
