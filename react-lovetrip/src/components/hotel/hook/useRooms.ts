import { useQuery, useQueryClient } from 'react-query'
import { useEffect } from 'react'
import { onSnapshot, collection, doc } from 'firebase/firestore'

import { store } from '@remote/firebase'
import { getRooms } from '@remote/room'
import { COLLECTIONS } from '@constants'
import { Room } from '@models/room'

function useRooms({ hotelId }: { hotelId: string }) {
  const client = useQueryClient()

  useEffect(() => {
    const unsubscribe = onSnapshot(
      //onSnapshot은 문서가 변하는 것을 계속 감지하고 문서가 바뀌는 시점에 동작을 함
      //첫번째 인자는 감지하고 싶은 대상, 두번째 인자는 snapshot
      collection(doc(store, COLLECTIONS.HOTEL, hotelId), COLLECTIONS.ROOM),
      //특정 hotel 문서에 룸 컬렉션 가져오기
      (snapshot) => {
        //snapshot을 이용해 저장된 데이터를 다시 업데이트 해주면됨
        //여기서 snapshot은 새롭게 변경된 데이터임
        const newRooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Room),
        }))

        client.setQueryData(['rooms', hotelId], newRooms)
        //하지만 저장된 데이터는 reactQuery가 캐시로 관리하고 있음
        //그래서 snapshot이 변경되었다면 클라이언트에 캐싱된 데이터를 가라치워 화면변경
        //따라서 변경하고 싶은 첫번째 인자로 캐싱키를 넣어주고 두번째 인자로 바꿀 데이터를 넣어주면 됨
      },
    )

    return () => {
      unsubscribe() //언마운트되면 이벤트 끊어주기
    }
  }, [hotelId, client])

  return useQuery(['rooms', hotelId], () => getRooms(hotelId))
  //호텔별로 룸정보가 캐싱
}

export default useRooms
