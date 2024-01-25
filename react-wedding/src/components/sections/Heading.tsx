import Section from '@shared/Section'
import styles from './Heading.module.scss'
import classNames from 'classnames/bind'
import { parseISO, format, getDay } from 'date-fns'

const cx = classNames.bind(styles)

const DAYS = [
  //상수는 컴포넌트 바깥에다가 해야함. 안에다가 하면 리렌더링 될때마다 새롭게 만들어져서
  //하지만 이런 상수는 매번 새롭게 만들 필요가 없어 바깥에다가 만듬
  'Sunday(일요일)',
  'Monday(월요일)',
  'Tuesday(화요일)',
  'Wednesday(수요일)',
  'Thursday(목요일)',
  'Friday(금요일)',
  'Saturday(토요일)',
]

const Heading = ({ date }: { date: string }) => {
  const weddingDate = parseISO(date)

  return (
    <Section className={cx('container')}>
      <div className={cx('txt-date')}>{format(weddingDate, 'yy.MM.dd')}</div>
      <div className={cx('txt-day')}>{DAYS[getDay(weddingDate)]}</div>
    </Section>
  )
}

export default Heading
