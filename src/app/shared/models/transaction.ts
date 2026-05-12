export interface Transaction {
  id: number;
  amount: number;
  notes: string;
  typeId: number;
  category: string;
  createdDate: number;
}
