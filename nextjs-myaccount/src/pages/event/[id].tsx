import { GetServerSidePropsContext } from 'next'
import { useQuery } from 'react-query'
import { isAfter, parseISO } from 'date-fns'

import { getEvent } from '@remote/event'
import { Event } from '@models/event'
import Preview from '@components/event/Preview'
import { useAlertContext } from '@contexts/AlertContext'

interface EventPageProps {
  initialEvent: Event
  id: string
}

function EventPage({ initialEvent, id }: EventPageProps) {
  const { open } = useAlertContext()
  const { data } = useQuery(['event', id], () => getEvent(id), {
    initialData: initialEvent,
    onSuccess: (event) => {
      //사용처에서 예외처리: 종료된 이벤트일 경우
      const 이벤트가종료되었는가 = isAfter(new Date(), parseISO(event.endDate))
      //isAfter를 사용해 오늘 날짜가 endDate를 넘었는지 확인
      //string임으로 parseISO 이용해 date 타입으로 변경
      if (이벤트가종료되었는가) {
        open({
          title: `${event.title} 이벤트가 종료되었어요`,
          description: '다음에 더 좋은 이벤트로 찾아오겠습니다',
          onButtonClick: () => {
            window.history.back()
          },
        })
      }
    },
  })
  if (data == null) {
    return null
  }
  return <Preview data={data} mode="preview" />
  //Preview가 공용으로 사용하기 좋도록 안에서 예외처리를 하기 보다는
  //여러가지 예외처리는 사용처에서 하도록 함
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query
  const event = await getEvent(id as string)

  return {
    props: { id, initialEvent: event },
  }
}

export default EventPage
