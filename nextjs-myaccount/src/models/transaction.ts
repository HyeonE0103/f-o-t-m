export type TransactionType = 'deposit' | 'withdraw'
//입금과 출금

export type TransactionFilterType = 'all' | TransactionType
//메뉴에 들어갈 내용

export interface Transaction {
  userId: string
  type: TransactionType
  amount: number
  balance: number
  displayText: string
  date: string
}
