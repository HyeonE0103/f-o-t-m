import { css } from '@emotion/react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

const Carousel = ({ images }: { images: string[] }) => {
  return (
    <div>
      <Swiper css={containerStyles} spaceBetween={8}>
        {/* spaceBetween을 이용하여 간격 띄우기 */}
        {images.map((imageUrl, i) => (
          <SwiperSlide key={imageUrl}>
            <img
              src={imageUrl}
              alt={`${i + 1}번째 호텔의 이미지`}
              css={imageStyles}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

const containerStyles = css`
  padding: 0 24px;
  height: 300px;
`

const imageStyles = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`
export default Carousel
