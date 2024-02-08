import { css } from '@emotion/react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const Carousel = ({ images }: { images: string[] }) => {
  return (
    <div>
      <Swiper css={containerStyles} spaceBetween={8}>
        {/* spaceBetween을 이용하여 간격 띄우기 */}
        {images.map((imageUrl, i) => (
          <SwiperSlide key={imageUrl}>
            <LazyLoadImage
              src={imageUrl}
              alt={`${i + 1}번째 호텔의 이미지`}
              css={imageStyles}
              height={300}
              // 이미지 불러오기 전에는 높이값을 가지지 않고 이기 때문에
              // 들썩일수 있어서 기본적으로 높이 값을 똑같이 맞추어 들썩임 방지
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
