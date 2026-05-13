import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { TransactionService } from './transaction-service';
import { Transaction } from '../../shared/models/transaction';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadTransactions', () => {
    it('should return empty array when localStorage is empty', () => {
      const service2 = new TransactionService();
      expect(service2['transactionsSubject'].value).toEqual([]);
    });

    it('should parse and return transactions from localStorage', () => {
      const mockTransactions: Transaction[] = [
        {
          id: 1,
          amount: 100,
          notes: 'Coffee',
          typeId: 1,
          category: '',
          createdDate: Date.now()
        }
      ];
      localStorage.setItem('transactions', JSON.stringify(mockTransactions));

      const service2 = new TransactionService();
      expect(service2['transactionsSubject'].value).toEqual(mockTransactions);
    });

    it('should return empty array when localStorage has invalid JSON', () => {
      localStorage.setItem('transactions', 'invalid-json{');
      const service2 = new TransactionService();
      expect(service2['transactionsSubject'].value).toEqual([]);
    });
  });

  describe('addTransaction', () => {
    it('should add transaction with correct properties', async () => {
      const amount = 250;
      const notes = 'Lunch';
      const typeId = 1;

      const result = await new Promise<Transaction>((resolve) => {
        service.addTransaction(amount, notes, typeId).subscribe((transaction) => {
          resolve(transaction);
        });
      });

      expect(result.amount).toBe(amount);
      expect(result.notes).toBe(notes);
      expect(result.typeId).toBe(typeId);
      expect(result.id).toBeDefined();
      expect(result.createdDate).toBeDefined();
    });

    it('should update transactionsSubject with new transaction', async () => {
      const initialCount = service['transactionsSubject'].value.length;
      
      await new Promise<void>((resolve) => {
        service.addTransaction(100, 'Test', 1).subscribe(() => {
          expect(service['transactionsSubject'].value.length).toBe(initialCount + 1);
          resolve();
        });
      });
    });

    it('should save transaction to localStorage', async () => {
      await new Promise<void>((resolve) => {
        service.addTransaction(300, 'Dinner', 2).subscribe(() => {
          const stored = localStorage.getItem('transactions');
          expect(stored).toBeTruthy();
          const parsed = JSON.parse(stored!);
          expect(Array.isArray(parsed)).toBe(true);
          expect(parsed.length).toBeGreaterThan(0);
          resolve();
        });
      });
    });

    it('should emit new transaction through transactions$ observable', async () => {
      let emissionCount = 0;
      let lastEmission: Transaction[] | null = null;

      await new Promise<void>((resolve) => {
        service.transactions$.subscribe((transactions) => {
          emissionCount++;
          lastEmission = transactions;
          if (emissionCount === 2) {
            // First emission is initial, second is after add
            expect(transactions.length).toBe(1);
            expect(transactions[0].notes).toBe('Grocery');
            resolve();
          }
        });

        service.addTransaction(500, 'Grocery', 1).subscribe();
      });
    });
  });

  describe('transactions$', () => {
    it('should return transactions from BehaviorSubject', async () => {
      await new Promise<void>((resolve) => {
        service.transactions$.subscribe((transactions) => {
          expect(Array.isArray(transactions)).toBe(true);
          resolve();
        });
      });
    });
  });
});
