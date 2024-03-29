import { collection, doc, writeBatch } from 'firebase/firestore'

import Button from '@shared/Button'
import { store } from '@remote/firebase'
import { COLLECTIONS } from '@constants/collection'

const FAQS = [
  {
    question: 'MyAccount는 어떤 서비스인가요',
    answer: '유저에게 편리한 경험을 제공해주는 자산 서비스입니다',
  },
  {
    question: '신용점수는 뭔가요?',
    answer: '개인의 신용도를 평가한 점수를 말합니다',
  },
  {
    question: '계좌는 어떻게 만들 수 있나요?',
    answer: '이벤트 배너 또는 홈의 계좌 개설 버튼을 이용해서 만들 수 있습니다',
  },
]

function FAQAddButton() {
  const handleButtonClick = () => {
    const batch = writeBatch(store)

    FAQS.forEach((faq) => {
      const docRef = doc(collection(store, COLLECTIONS.FAQ))

      batch.set(docRef, faq)
    })

    batch.commit().then(() => {
      window.alert('FAQ 데이터 추가!')
    })
  }

  return <Button onClick={handleButtonClick}>FAQ 데이터추가</Button>
}

export default FAQAddButton
