import { useEffect, useState } from 'react'

import classNames from 'classnames/bind'
import styles from './App.module.scss'

import Heading from '@components/sections/Heading'
import Video from '@components/sections/Video'
import { Wedding } from '@models/wedding'
import ImageGallery from '@components/sections/ImageGallery'
import Intro from '@components/sections/Intro'
import Invitation from '@components/sections/Invitation'
import Calendar from '@components/sections/Calendar'
import Map from '@components/sections/Map'
import Contact from '@components/sections/Contact'
import Share from '@components/sections/Share'
import FullScreanMessage from '@shared/FullScreanMessage'
import AttendCountModal from '@components/AttendCountModal'

const cx = classNames.bind(styles)

function App() {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  //1. wedding 데이터 호출
  useEffect(() => {
    setLoading(true)

    fetch('http://localhost:8888/wedding')
      .then((res) => {
        //fetch는 404같은 에러를 만나면 에러를 reject하지 않음
        if (res.ok === false) {
          //따라서 따로 예외 처리가 필요함
          throw new Error('청첩장 정보를 불러오지 못했습니다')
          //에러 쓰로우 바로 catch로 이동
        }
        return res.json()
      })
      .then((data) => {
        setWedding(data)
      })
      .catch((e) => {
        setError(true)
      })
      .finally(() => {
        //성공했든 실패했든 무조건 실행
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <FullScreanMessage type="loading" />
  }
  if (error) {
    return <FullScreanMessage type="error" />
  }
  if (wedding === null) {
    return null
  }
  const {
    date,
    galleryImages,
    groom,
    bride,
    location,
    message: { intro, invitation },
  } = wedding

  return (
    <div className={cx('container')}>
      <Heading date={date} />
      <Video />
      <Intro
        groomName={groom.name}
        brideName={bride.name}
        locationName={location.name}
        date={date}
        message={intro}
      />
      <Invitation message={invitation} />
      <ImageGallery images={galleryImages} />
      <Calendar date={date} />
      <Map location={location} />
      <Contact groom={groom} bride={bride} />
      <Share groomName={groom.name} brideName={bride.name} date={date} />
      <AttendCountModal wedding={wedding} />
    </div>
  )
}

export default App
