import HotelFormAddButton from '@/components/test/HotelFormAddButton'
import HotelListAddButton from '@/components/test/HotelListAddButton'
import RecommendHotelButton from '@/components/test/RecommendHotelButton'

const Test = () => {
  //호텔추가 버튼을 누르면 여러가지 호텔데이터를 만들어서 firebase 저장
  return (
    <>
      <HotelListAddButton />
      <RecommendHotelButton />
      <HotelFormAddButton />
    </>
  )
}

export default Test
