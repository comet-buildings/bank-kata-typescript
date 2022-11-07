import { AccountService } from "./account.service";
import { DateTime, Settings } from 'luxon';
class Account implements AccountService {
  private balance: number = 0;
  private history: string[] = [];

  private getSystemDate = () => DateTime.now().toLocaleString();
  
  deposit(amount: number): void {
    this.balance += amount
    this.history.push(`${this.getSystemDate()}||${amount}||${this.balance}`);
  }
  withdraw(amount: number): void {
    this.balance -= amount;
    this.history.push(`${this.getSystemDate()}||-${amount}||${this.balance}`);
  }
  printStatement(): void {
    console.log('Date||Amount||Balance');
    this.history.reverse().forEach(console.log);
  }
}

const currentDate = (year: number, month: number, day: number) => {
  Settings.now = () => new Date(year, month - 1, day).valueOf();
}

describe("Account service", () => {
  let history: string[] = [];
  const realConsoleLog = console.log;
  beforeEach(() => {
    console.log = (input: string) => {
      realConsoleLog(input); // je logge
      history.push(input); // je pousse dans mon historique
    }
  })
  afterEach(() => {
    history = [];
    console.log = realConsoleLog;
    Settings.now = () => new Date().getTime();
  })

  it("should print statement acceptance test", () => {
    // Given
    const account = new Account();

    currentDate(2012, 1, 10)
    account.deposit(1000) // 10/01/2012

    currentDate(2012, 1, 13)
    account.deposit(2000) // 13/01/2012

    currentDate(2012, 1, 14)
    account.withdraw(500) // 14/01/2012
    
    // When 
    account.printStatement()
    
    // Then 
    expect(history).toEqual([
      'Date||Amount||Balance', 
      '14/01/2012||-500||2500', 
      '13/01/2012||2000||3000', 
      '10/01/2012||1000||1000'])
  });

  it('Should return an empty statement', () => {
    // given
    const account = new Account
    // when 
    account.printStatement()
    // then 
    expect(history).toEqual([
      'Date||Amount||Balance'])
  })
  it('Should return a statement with deposit', () => {
    // given
    const account = new Account
    // when
    currentDate(2012, 1, 10)
    account.deposit(1000) 
    account.printStatement()
    // then 
    expect(history).toEqual([
      'Date||Amount||Balance','10/01/2012||1000||1000' ])
  })
  it('Should return a statement with deposit', () => {
    // given
    const account = new Account
    // when
    currentDate(2012, 1, 10)
    account.deposit(1000) 
    currentDate(2012, 1, 13)
    account.deposit(2000) 
    account.printStatement()
    // then 
    expect(history).toEqual([
      'Date||Amount||Balance','13/01/2012||2000||3000', '10/01/2012||1000||1000' ])
  })
});
