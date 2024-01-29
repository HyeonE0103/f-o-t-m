import Top from '@/components/shared/Top'
import { getAdBanners } from '@/remote/adBanner'
import { getCards } from '@/remote/card'
import React, { useEffect } from 'react'

const HomePage = () => {
  useEffect(() => {
    getCards().then((res) => {
      console.log('card', res)
    })
    getAdBanners().then((res) => {
      console.log('adBanner', res)
    })
  }, [])
  return (
    <div>
      <Top
        title="혜택 좋은 카드"
        subTitle="회원님을 위한 혜택 좋은 카드를 추천해드려요"
      />
    </div>
  )
}

export default HomePage
