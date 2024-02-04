import { useQuery } from 'react-query'
import { getRecommendHotels } from '@remote/hotel'

const useRecommendHotels = ({ hotelIds }: { hotelIds: string[] }) => {
  return useQuery(
    ['recommendHotels', JSON.stringify(hotelIds)],
    //hotelIds는 배열이기 때문에 문자열로 바꿔서 캐싱 배열에 넣음
    () => getRecommendHotels(hotelIds),
    {
      enabled: hotelIds.length > 0,
      //추천호텔이 있다면 데이터를 가져옴
    },
  )
}

export default useRecommendHotels
