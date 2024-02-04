import { useQuery } from 'react-query'
import { getHotel } from '@remote/hotel'

const useHotel = ({ id }: { id: string }) => {
  return useQuery(['hotel', id], () => getHotel(id))
  //배열에 id를 주어 호텔마다 고유한 캐시를 하도록 만듬
}

export default useHotel
