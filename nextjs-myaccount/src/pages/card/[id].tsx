import { GetServerSidePropsContext } from 'next'
import { useQuery } from 'react-query'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import { getCard } from '@remote/card'
import { Card } from '@models/card'
import Top from '@shared/Top'
import ListRow from '@shared/ListRow'
import Flex from '@shared/Flex'
import Text from '@shared/Text'

const FixedBottomButton = dynamic(() => import('@shared/FixedBottomButton'), {
  ssr: false,
  //현재 FixedBottomButton은 portal을 이용해서 버튼을 그리고 있기 때문에
  //다이나믹하게 불러오고 ssr을 false로 두어 ssr단계에서는 FixedBottomButton
  //존재를 모르게 그리지 않도록 함
})

interface CardDetailPageProps {
  initialCard: Card
}

function CardDetailPage({ initialCard }: CardDetailPageProps) {
  //getServerSideProps -> app -> <Component {...pageProps} />
  //식으로 initialCard가 내려옴

  const { id } = useParams()
  //useParams를 이용해서 url에 param값을 빼올수 있음

  const { data } = useQuery(['card', id], () => getCard(id as string), {
    initialData: initialCard,
    //최초의 카드 값이 온전하게 들어왔으면 호출을 안함
    //서버에서 데이터를 잘 불러왔고 불러온 데이터를 useQuery에
    //initialData로 넣어주었기 때문에 처음부터 데이터가 비어있지 않음(undefined X)
  })
  //서버에서 데이터를 불렀지만 데이터가 온전하게 불러와지지 않았을 수도
  //있기 때문에 클라이언트에서 다시 한번 채워줌

  if (data == null) {
    return
  }

  const { name, corpName, promotion, tags, benefit } = data
  console.log('tags', tags, 'promotion', promotion)
  const subTitle =
    promotion != null ? removeHtmlTags(promotion.title) : tags.join(',')
  //promotion이 있다면 불필요한 태그들을 지워서 보여주고
  //promotion이 없다면 tags를 쉼표로 묶어서 보여줌
  return (
    <div>
      <Top title={`${corpName} ${name}`} subTitle={subTitle} />

      <ul>
        {benefit.map((text, index) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, translateX: -90 }}
            transition={{
              duration: 0.7,
              ease: 'easeInOut',
              delay: index * 0.3,
            }}
            animate={{
              opacity: 1,
              translateX: 0,
            }}
          >
            <ListRow
              as="div"
              left={
                <Image
                  src="https://cdn4.iconfinder.com/data/icons/travello-basic-ui-1/64/Correct-512.png"
                  width={40}
                  height={40}
                  alt=""
                />
              }
              contents={
                <ListRow.Texts title={`혜택 ${index + 1}`} subTitle={text} />
              }
            />
          </motion.li>
        ))}
      </ul>

      {promotion != null ? (
        <Flex
          direction="column"
          style={{ marginTop: '80px', padding: '0 24px 80px 24px' }}
        >
          <Text bold={true}>유의사항</Text>
          <Text typography="t7">{removeHtmlTags(promotion.terms)}</Text>
        </Flex>
      ) : null}

      <FixedBottomButton
        label="1분만에 신청하고 혜택받기"
        onClick={() => {
          // TODO:
        }}
      />
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //url에 있는 param은 ServerSideProps 내려주는 context안에 들어있음
  const { query } = context
  //context안에 query라는 객체가 있음 그리고 query안에 id가 들어있음
  const cardId = query.id as string

  const card = await getCard(cardId)

  return {
    props: {
      initialCard: card,
      //initialCard라고 해서 card의 초기값을 넘겨줌
      //getServerSideProps -> app -> <Component {...pageProps} />
    },
  }
}

function removeHtmlTags(text: string) {
  return text.replace(/<\/?[^>]+(>|$)/g, '')
}

export default CardDetailPage
