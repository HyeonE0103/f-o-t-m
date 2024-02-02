import React from 'react'
import Flex from '@shared/Flex'
import Text from '@shared/Text'
import { css } from '@emotion/react'
import { colors } from '@/styles/colorPalette'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getAdBanners } from '@remote/adBanners'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

const AdBanners = () => {
  const { data, isLoading } = useQuery(['adBanners'], () => getAdBanners())

  if (data == null || isLoading) {
    //데이터가 없거나 로딩중이라면
    return (
      <Container>
        <Flex direction="column" css={bannerContainerStyles}>
          <Text bold={true}>&nbsp;</Text>
          {/* &nbsp;는 공백을 나타나는 특수문자. 즉 있는채하기 위해 넣음 */}
          <Text typography="t7">&nbsp;</Text>
        </Flex>
      </Container>
    )
  }

  return (
    <Container>
      <Swiper spaceBetween={8}>
        {data?.map((banner) => {
          return (
            <SwiperSlide key={banner.id}>
              <Link to={banner.link}>
                <Flex direction="column" css={bannerContainerStyles}>
                  <Text bold={true}>{banner.title}</Text>
                  <Text typography="t7">{banner.description}</Text>
                </Flex>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </Container>
  )
}

const Container = styled.div`
  padding: 24px;
`

const bannerContainerStyles = css`
  padding: 16px;
  background-color: ${colors.gray};
  border-radius: 4px;
`

export default AdBanners
