import styled from '@emotion/styled'

import { colors } from '@styles/colorPalette'

const BaseProgressBar = styled.div<{ progress: number }>(({ progress }) => ({
  //파랑색 바, progress는 최소 0 ~ 최대 1
  height: 10,
  backgroundColor: colors.blue,
  transform: `scaleX(${progress})`, //왼쪽에서 오른쪽으로 키어감
  transition: 'transform 0.3s', //스무스하게 ProgressBar가 차도록
  transformOrigin: 'left', //왼쪽부터 시작
}))

const Container = styled.div(() => ({
  //바뒤에 있는 회색 배경
  width: '100%',
  height: 10,
  backgroundColor: colors.gray,
  overflow: 'hidden', //파랑색 바가 넘쳤을때는 짤라버림 안보이게
  borderRadius: 6,
}))

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <Container>
      <BaseProgressBar progress={progress} />
    </Container>
  )
}

export default ProgressBar
