import FixedBottomButton from '@shared/FixedBottomButton'
import ListRow from '@shared/ListRow'
import Top from '@shared/Top'
import { getCard } from '@/remote/card'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import Flex from '@shared/Flex'
import Text from '@shared/Text'
import { css } from '@emotion/react'
import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { useAlertContext } from '@/contexts/AlertContext'
import useUser from '@/hooks/auth/useUser'

const Card = () => {
  const user = useUser()
  const navigate = useNavigate()
  const { open } = useAlertContext()
  const { id = '' } = useParams()
  //항상 id가 있다는 것이 보장되지 않기 때문에 default value를 줌

  const moveToApply = useCallback(() => {
    if (user == null) {
      //로그인을 안했다면 alert을 띄우고 로그인창으로 이동
      open({
        title: '로그인이 필요한 기능입니다.',
        onButtonClick: () => {
          navigate(`/signin`)
        },
      })
      return //리턴을 해서 끊어주기
    }
    navigate(`/apply/${id}`) //로그인했다면 apply페이지 이동
  }, [user, id, open, navigate])

  const { data } = useQuery(['card', id], () => getCard(id), {
    enabled: id !== '', //id가 없으면 조회하는 이유가 없어서 id가 있을때만 호출
  })
  //배열에 값을 넣으면 카드와 id를 묶어서 캐시키를 만들게 됨

  if (data == null) return null

  const { name, corpName, promotion, tags, benefit } = data
  //위에 null인 경우 return을 안하면 data가 undefined 일수도 있어 ts오류 발생

  const subTitle =
    promotion != null ? removeHtmlTags(promotion.title) : tags.join(',')
  //프로포션이 있다면 프로모션 정보를 노출하고 아니면 tag정보 노출

  return (
    <div>
      <Top title={`${corpName} ${name}`} subTitle={subTitle} />
      <ul>
        {benefit.map((text, i) => {
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, translateX: -90 }}
              // whileInView={{
              //   //해당 요소가 화면에 보이면 다시 애니메이션이 실행됨
              //   opacity: 1,
              //   translateX: 0,
              // }}
              transition={{
                duration: 0.7,
                ease: 'easeInOut',
                //애니메이션 속도는 easeInOut으로 줄수도 있고 직접 값을 줄 수도 있음
                delay: i * 0.1,
                //delay를 주어 해당 애니메이션을 순차적으로 보이게
              }}
              animate={{ opacity: 1, translateX: 0 }}
            >
              {/* li태그를 가지도록 함 */}
              <ListRow
                as="div"
                key={text}
                left={<IconCheck />}
                contents={
                  <ListRow.Texts title={`혜택 ${i + 1}`} subTitle={text} />
                }
              />
            </motion.li>
          )
        })}
      </ul>

      {promotion && (
        <Flex direction="column" css={termsContainerStyles}>
          <Text bold={true}>유의사항</Text>
          <Text typography="t7">{removeHtmlTags(promotion.terms)}</Text>
        </Flex>
      )}

      <FixedBottomButton label="신청하기" onClick={moveToApply} />
    </div>
  )
}

const termsContainerStyles = css`
  margin-top: 80px;
  padding: 0 24px 80px 24px;
`

const IconCheck = () => {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 48 48"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="white" fillOpacity="0.01" height="48" width="48" />
      <path
        d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"
        fill="#2F88FF"
        stroke="black"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M16 24L22 30L34 18"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  )
}

const removeHtmlTags = (text: string) => {
  let output = ''
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '<') {
      for (let j = i + 1; j < text.length; j += 1) {
        if (text[j] === '>') {
          i = j
          break
        }
      }
    } else output += text[i]
  }
  return output
}

export default Card
