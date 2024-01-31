import { User } from './user'

export interface Term {
  id: string
  link?: string
  title: string
}

export interface ApplyValues {
  userId: User['uid'] //어떤 유저가 신청했는지
  terms: Array<Term['id']> //어떤 약관에 동의했는지
  appliedAt: Date //언제 신청했는지
  cardId: string //카드 id
  salary: string
  creditScore: string
  payDate: string
  isMaster: boolean
  isHipass: boolean
  isRf: boolean
}

export interface Option {
  label: string
  value: string | number | undefined
}
