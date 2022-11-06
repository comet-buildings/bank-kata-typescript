export interface AccountService {
  deposit(amount: number): void;
  withdraw(amount: number): void;
  printStatement(): void;
}
