import { useCallback, useState, MouseEvent } from 'react'

import Button from '@shared/Button'
import Spacing from '@shared/Spacing'
import FixedBottomButton from '@shared/FixedBottomButton'

import { ApplyValues } from '@models/apply'
import { css } from '@emotion/react'

type CardInfoValues = Pick<ApplyValues, 'isHipass' | 'isMaster' | 'isRf'>

const CardInfo = ({
  onNext,
}: {
  onNext: (cardInfoValues: CardInfoValues) => void
}) => {
  const [cardInfoValues, setCardInfoValues] = useState<CardInfoValues>({
    isHipass: false,
    isMaster: false,
    isRf: false,
  })

  const { isHipass, isMaster, isRf } = cardInfoValues

  const handleButtonClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const $button = e.target as HTMLButtonElement
    //HTMLButtonElement라고 정리해주어야지 data set이나 value에 접근가능
    //<button name="isMaster" data-value="true" class="css-1wkvmps">Master</button>

    setCardInfoValues((prevValues) => ({
      ...prevValues,
      [$button.name]: JSON.parse($button.dataset.value as string),
      //값을 밑에서 boolean으로 넣어주었지만 콘솔로 확인해보면 string으로 되어있음
      //따라서 실제 값을 업데이트 할때는 다시 boolean으로 바꾸기 위해 JSON.parse거쳐 string을 boolean으로 변경
    }))
  }, [])

  return (
    <div css={containerStyles}>
      <Button.Group title="해외결제">
        <Button
          name="isMaster"
          weak={isMaster === false}
          //마스터가 선택되지 않았을때 배경색 진하게 글씨 하얗게
          size="medium"
          data-value={true}
          onClick={handleButtonClick}
        >
          Master
        </Button>
        <Button
          name="isMaster"
          weak={isMaster === true}
          //마스터가 선택된 상태라면 국내전용은 선택되지 못한 상태
          size="medium"
          data-value={false}
          onClick={handleButtonClick}
        >
          국내전용
        </Button>
      </Button.Group>

      <Spacing size={12} />

      <Button.Group title="후불교통기능">
        <Button
          name="isRf"
          weak={isRf === true}
          size="medium"
          data-value={false}
          onClick={handleButtonClick}
        >
          신청안함
        </Button>
        <Button
          name="isRf"
          weak={isRf === false}
          size="medium"
          data-value={true}
          onClick={handleButtonClick}
        >
          신청
        </Button>
      </Button.Group>

      <Spacing size={12} />

      <Button.Group title="후불하이패스카드">
        <Button
          name="isHipass"
          weak={isHipass === true}
          size="medium"
          data-value={false}
          onClick={handleButtonClick}
        >
          신청안함
        </Button>
        <Button
          name="isHipass"
          weak={isHipass === false}
          size="medium"
          data-value={true}
          onClick={handleButtonClick}
        >
          신청
        </Button>
      </Button.Group>

      <FixedBottomButton
        label="다음"
        onClick={() => {
          onNext(cardInfoValues)
        }}
      />
    </div>
  )
}

export default CardInfo

const containerStyles = css`
  padding: 24px;
`
