import styles from './Calendar.module.scss'
import classNames from 'classnames/bind'
import Section from '@shared/Section'
import { parseISO, format, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import { DayPicker } from 'react-day-picker'
import { memo } from 'react'

const cx = classNames.bind(styles)

const css = `
  .rdp-caption{
    display: none;
  }
  .rdp-cell {
    cursor: default;
    // 커서가 올라가도 반응없이 똑같게
  }
  .rdp-head_cell {
    font-weight: bold;
    font-size: 14px;
  }
  .rdp-day_selected {
    background-color: var(--red);
  }
  .rdp-day_selected:hover {
    background-color: var(--red);
    //기본 css에 hover가 있어 상쇄해주기 위해
  }
`

const Calendar = ({ date }: { date: string }) => {
  const weddingDate = parseISO(date)
  //weddingDate = Sun Aug 27 2023 13:00:00 GMT+0900

  return (
    <Section
      title={
        <div className={cx('wrap-header')}>
          <span className={cx('txt-date')}>
            {format(weddingDate, 'yy.MM.dd')}
          </span>
          {/* 00년 00월 00일 */}
          <span className={cx('txt-time')}>
            {format(weddingDate, 'aaa h시 eeee', { locale: ko })}
          </span>
          {/* 오전/오후 시 요일 */}
        </div>
      }
    >
      <div className={cx('wrap-calendar')}>
        <style>{css}</style>
        <DayPicker
          locale={ko}
          month={weddingDate}
          selected={weddingDate}
          formatters={{ formatCaption: () => '' }}
        />
        {/* month에 보여주고 싶은 날짜를 넣으면 날짜를 포함하고 있는 달을 디폴트로 보여줌
        selected에 넣으면 해당 날짜를 짚어줌. locale를 언어설정
        formatters에 formatCaption으로 넣음 문자열이 달력의 제목이 됨 현재는 없애고 싶어서 빈문자열*/}
      </div>
    </Section>
  )
}

export default memo(Calendar)
