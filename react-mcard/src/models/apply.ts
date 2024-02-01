import { User } from './user'

export interface Term {
  id: string
  link?: string
  title: string
}

export const APPLY_STATUS = {
  REDAY: 'REDAY', //준비단계
  PROGRESS: 'PROGRESS', //진행단계
  COMPLETE: 'COMPLETE', //완료단계
  REJECT: 'REJECT', //거절
} as const

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
  status: keyof typeof APPLY_STATUS
  //key값만 빼옴
  step: number
}

export interface Option {
  label: string
  value: string | number | undefined
}
