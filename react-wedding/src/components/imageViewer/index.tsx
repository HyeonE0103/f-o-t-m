import styles from './ImageViewer.module.scss'
import classNames from 'classnames/bind'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import './swiper.css'
import Dimmed from '../shared/Dimmed'

const cx = classNames.bind(styles)

const ImageViewer = ({
  images,
  open = false,
  selectedIdx,
  onClose,
}: {
  images: string[]
  open: boolean
  selectedIdx: number
  onClose: () => void
}) => {
  return (
    <>
      {open && (
        <Dimmed>
          <CloseButton className={cx('icon-close')} onClose={onClose} />
          {/* 모달 등에 뒤에 깔리는 검은화면을 dimmed라고 함 */}
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            initialSlide={selectedIdx}
          >
            {/* spaceBetween:이미지간 간격 slidesPerView: 한 화면에 몇장까지 보여줄것인지
        loop:반복되도록 마지막이면 다시 처음으로 initialSlide: 어떤 이미지로 시작할것인지*/}
            {images.map((src, i) => {
              return (
                <SwiperSlide key={i}>
                  <img src={src} alt="이미지 뷰어" />
                </SwiperSlide>
              )
            })}
          </Swiper>
        </Dimmed>
      )}
    </>
  )
}
export default ImageViewer

const CloseButton = ({
  onClose,
  className,
}: {
  onClose: () => void
  className: string
}) => {
  return (
    <svg
      enable-background="new 0 0 32 32"
      height="32px"
      id="svg2"
      version="1.1"
      viewBox="0 0 32 32"
      width="32px"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClose}
      className={className}
    >
      <g id="background">
        <rect fill="none" height="32" width="32" />
      </g>
      <g id="cancel">
        <polygon points="2,26 6,30 16,20 26,30 30,26 20,16 30,6 26,2 16,12 6,2 2,6 12,16  " />
      </g>
    </svg>
  )
}
