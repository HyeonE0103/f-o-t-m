import { useRouter } from 'next/router'
import { useRef, useEffect, useState, useCallback, ChangeEvent } from 'react'
import { useQuery } from 'react-query'

import Input from '@shared/Input'
import Top from '@shared/Top'
import { getSearchCards } from '@remote/card'
import ListRow from '@shared/ListRow'
import Text from '@shared/Text'
import Badge from '@shared/Badge'
import useDebounce from '@/hooks/useDebounce'

function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce(keyword)

  const navigate = useRouter()

  const inputRef = useRef<HTMLInputElement>(null)

  const { data } = useQuery(
    ['cards', debouncedKeyword],
    () => getSearchCards(debouncedKeyword),
    {
      enabled: debouncedKeyword !== '',
      //키워드가 빈 문자열이 아닌 경우에만
    },
  )

  useEffect(() => {
    if (inputRef.current) {
      //페이지에 들어가자마자 input에 focus가 가도록 처리
      inputRef.current.focus()
    }
  }, [])

  const handleKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }, [])

  return (
    <div>
      <Top title="추천카드" subTitle="회원님을 위해 준비했어요" />
      <div style={{ padding: '0 24px 12px 24px' }}>
        <Input ref={inputRef} value={keyword} onChange={handleKeyword} />
      </div>

      {keyword !== '' && data?.length === 0 ? (
        //빈문자열이 아님에도 데이터가 없다면 검색을 했음에도 데이터가 없는 것
        <div style={{ padding: 24 }}>
          <Text>찾으시는 카드가 없습니다</Text>
        </div>
      ) : (
        <ul>
          {data?.map((card, index) => (
            <ListRow
              key={card.id}
              contents={
                <ListRow.Texts title={`${index + 1}위`} subTitle={card.name} />
              }
              right={
                card.payback != null ? <Badge label={card.payback} /> : null
              }
              withArrow={true}
              onClick={() => {
                navigate.push(`/card/${card.id}`)
              }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchPage
