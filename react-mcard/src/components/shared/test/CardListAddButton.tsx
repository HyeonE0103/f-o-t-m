import { card_list } from '@/mock/data'
import { store } from '@/remote/firebase'
import { collection, doc, writeBatch } from 'firebase/firestore'
import Button from '@shared/Button'
import { COLLECTIONS } from '@/constants'

const CardListAddButton = () => {
  const handleButtonClick = async () => {
    const batch = writeBatch(store)
    //하나하나 넣는 것이 아니라 한번에 처리

    card_list.forEach((card) => {
      //card_list 루프를 돌면서 값을 누적 그리고 누적된 값을 저장

      const docRef = doc(collection(store, COLLECTIONS.CARD))
      //collection에 접근. firebase는 colletion 단위로 데이터를 관리함

      batch.set(docRef, card)
      //docRef문서에 리스트를 돌면서 나온 card데이터를 batch해서 저장. 아직 저장 X
    })

    batch.commit() //commit(비동기임)을 해야 저장O, 실제 값이 반영
    alert('카드 리스트 추가 완료!')
  }

  return <Button onClick={handleButtonClick}>카드 리스트 추가하기</Button>
}
export default CardListAddButton
