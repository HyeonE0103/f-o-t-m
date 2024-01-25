import styles from './Map.module.scss'
import classNames from 'classnames/bind'
import Section from '@shared/Section'
import { useEffect, useRef } from 'react'
import { Location } from '@models/wedding'

declare global {
  interface Window {
    kakao: any
  }
}

const cx = classNames.bind(styles)

const Map = ({ location }: { location: Location }) => {
  const mapContainer = useRef(null)

  useEffect(() => {
    //외부스크립트를 비동기적으로 가져옴
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_APP_KEY}&autoload=false`
    // 비동기적으로 script를 가져옴. autoload는 싱크가 안맞을수 있으니 불러오는것은 할것인데 그다음 load는 우리가 할것이라는 의미
    script.async = true //script 비동기적으로 가져옴

    document.head.appendChild(script) //head에 script 넣어주기
    script.onload = () => {
      //script가 불러온 시점에 카카오 맵을 실행
      window.kakao.maps.load(() => {
        const position = new window.kakao.maps.LatLng(
          location.lat,
          location.lng,
        )
        const options = {
          center: position,
          level: 3,
        }
        const marker = new window.kakao.maps.Marker({
          position,
        })

        const map = new window.kakao.maps.Map(mapContainer.current, options)
        marker.setMap(map)
      })
    }
  }, [])
  return (
    <Section
      title={
        <div className={cx('wrap-header')}>
          <span className={cx('txt-title')}>오시는 길</span>
          <span className={cx('txt-subtitle')}>{location.name}</span>
          <span className={cx('txt-subtitle')}>{location.address}</span>
        </div>
      }
    >
      <div className={cx('wrap-map')}>
        <div className={cx('map')} ref={mapContainer} />
        <a
          className={cx('btn-find-way')}
          href={location.link}
          target="_blank"
          // 새탭으로 열리게
          rel="noreferrer"
        >
          길찾기
        </a>
      </div>

      <div>
        <WayToCome label="버스" list={location.waytocome.bus} />
        <WayToCome label="지하철" list={location.waytocome.metro} />
      </div>
    </Section>
  )
}

export default Map

const WayToCome = ({
  label,
  list,
}: {
  label: React.ReactNode
  list: string[]
}) => {
  return (
    <div className={cx('wrap-waytocome')}>
      <div className={cx('txt-label')}>{label}</div>
      <ul>
        {list.map((waytocome, i) => (
          <li key={i}>{waytocome}</li>
        ))}
      </ul>
    </div>
  )
}
