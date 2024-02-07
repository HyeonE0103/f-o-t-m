import { useCallback, useState, useEffect } from 'react'
import { useQueryClient } from 'react-query'

import { Like } from '@models/like'
import useLike from '@hooks/like/useLike'
import { updateOrder } from '@remote/like'
import { useAlertContext } from '@contexts/AlertContext'

const useEditLike = () => {
  const { data } = useLike()
  // like 목록 가져오기
  const [updatedLikes, setUpdatedLikes] = useState<Like[]>([])
  const [isEdit, setIsEdit] = useState(false)
  //유저가 순서를 변경했는지 유무
  const { open } = useAlertContext()
  const client = useQueryClient()

  useEffect(() => {
    if (data != null) {
      //데이터가 null이 아니면 updatedLikes기본값을 data로 시작하도록
      setUpdatedLikes(data)
    }
  }, [data])

  const reorder = useCallback((from: number, to: number) => {
    //순서를 재정의해주는 함수
    setIsEdit(true)
    setUpdatedLikes((prevUpdatedLikes) => {
      const newItems = [...prevUpdatedLikes]

      const [fromItem] = newItems.splice(from, 1)
      //해당 요소 제거 및 변수 저장

      if (fromItem != null) {
        //해당 바꾼 요소 순서 변경(dnd 인덱스 변경)
        newItems.splice(to, 0, fromItem)
      }

      newItems.forEach((like, index) => {
        //전체 리스트 order 오름차순으로 만들기
        like.order = index + 1
      })

      return newItems
    })
  }, [])

  const save = async () => {
    try {
      await updateOrder(updatedLikes)
      client.setQueriesData(['likes'], updatedLikes)
      //해당 키를 가진 query에 데이터를 updatedLikes로 변경
      //이렇게 하면 서버에서 새롭게 데이터를 가지고 오지 않더라도 캐시 된 데이터를 변경하여 업데이트 효과
      setIsEdit(false)
    } catch (e) {
      open({
        title: '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요',
        onButtonClick: () => {
          setIsEdit(false)
        },
      })
    }
  }

  return { data: isEdit ? updatedLikes : data, isEdit, reorder, save }
  // isEdit상태라면 updatedLikes를 넘겨주고 아니라면 서버에서 가져온 원본을 data로 넘겨줌
}

export default useEditLike
