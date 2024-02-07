import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'

import { getLikes, toggleLike } from '@remote/like'
import useUser from '@hooks/auth/useUser'
import { Hotel } from '@models/hotel'
import { useAlertContext } from '@contexts/AlertContext'

const useLike = () => {
  const user = useUser()
  const { open } = useAlertContext()
  const navigate = useNavigate()
  const client = useQueryClient()

  const { data } = useQuery(
    ['likes'],
    () => getLikes({ userId: user?.uid as string }),
    //호출되었다면 use가 있다는 것이기 때문에 as string으로
    {
      enabled: user != null, //유저가 로그인했을 경우만
    },
  )

  const { mutate } = useMutation(
    ({ hotel }: { hotel: Pick<Hotel, 'name' | 'id' | 'mainImageUrl'> }) => {
      if (user == null) {
        //찜하기는 로그인한 유저만 가능하기 때문에 로그인안했다면 에러 쓰로우
        throw new Error('로그인필요')
      }

      return toggleLike({ hotel, userId: user.uid })
    },
    {
      onSuccess: () => {
        //데이터가 캐시되어있고 새롭게 불러오지 않기 때문에 DB에는 반영됬지만
        //새로고침을 하지 않으면 유저 화면에서는 알수 없음
        //query자체를 refetch하는 방법도 있지만 캐싱된 데이터를 상했다고 판단하고 재갱신시킴
        //client에 invalidateQueries를 사용해서 키값을 가진 애들을 캐시 데이터 버리고 재갱신
        client.invalidateQueries(['likes'])
      },
      onError: (e: Error) => {
        //에러 message가 로그인필요면 위에서 로그인안했다고 한 그 오류
        if (e.message === '로그인필요') {
          open({
            title: '로그인이 필요한 기능입니다',
            onButtonClick: () => {
              navigate('/signin')
            }, //로그인 하도록 alert을 띄운 후 로그인 페이지로 보냄
          })

          return
        }

        open({
          title: '알 수 없는 에러가 발생했습니다. 잠시후 다시 시도해주세요',
          onButtonClick: () => {
            // 다른 액션
          },
        })
      },
    },
  )

  return { data, mutate }
}

export default useLike
