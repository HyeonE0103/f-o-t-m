import { collection, writeBatch, getDocs } from 'firebase/firestore'

import { COLLECTIONS } from '@constants'
import { store } from '@remote/firebase'
import Button from '@shared/Button'

// 1.전체 호텔 가져오기
// 2. 전체 호텔 루프돌기
// 3. 호텔 + 추천호텔(본인호텔 제외 호텔) 아이디 5개 추가
//    아이디를 넣어주는 이유는 데이터를 넣어주면 해당 호텔에 데이터가 바뀌면 여기서도 추가로 바꿔주어야 하기 때문

function RecommendHotelButton() {
  const handleButtonClick = async () => {
    const batch = writeBatch(store)
    const snapshot = await getDocs(collection(store, COLLECTIONS.HOTEL))
    //store에 있는 호텔 콜렉션에 접근해서 호텔 전체 데이터를 가져옴

    snapshot.docs.forEach((hotel) => {
      const 추천호텔리스트 = []

      for (let doc of snapshot.docs) {
        if (추천호텔리스트.length === 5) {
          //추천호텔리스트 5개 채움 끝내버림
          break
        }

        if (doc.id !== hotel.id) {
          //전체 for문을 돌고있는 해당 호텔과 그 안에 2중 for문을 돌아서
          //호텔리스트에 들어가는 호텔에 id가 같지 않으면 호텔추천리스트에 넣음
          추천호텔리스트.push(doc.id)
        }
      }

      batch.update(hotel.ref, {
        //한번에 넣어버리기. 지금 순회하는 호텔정보를 넣어서 추천호텔 리스트를 업데이트 함
        recommendHotels: 추천호텔리스트,
      })
    })

    await batch.commit()
    //한번에 업데이트

    alert('업데이트가 완료되었습니다.')
  }

  return <Button onClick={handleButtonClick}>추천호텔 데이터 추가하기</Button>
}

export default RecommendHotelButton
