import { useEffect, useState, useRef } from 'react'
import { SerializedStyles } from '@emotion/react'

import { Colors, colors } from '@styles/colorPalette'

const ScrollProgressBar = ({
  style,
  color = 'blue980',
}: {
  style?: SerializedStyles
  color?: Colors
}) => {
  const [progress, setProgress] = useState(0)
  //기준이 될 가로막대
  const rafRef = useRef<number | null>(null)
  //requestAnimationFrame를 담아둘 ref

  useEffect(() => {
    const scroll = () => {
      const scrollTop = document.documentElement.scrollTop
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      //전체 높이에서 뷰포트를 뺌

      if (rafRef.current) {
        //스크롤이벤트는 너무빠른 시간내에 많은 작업이 일어나기 때문에 rafRef값이 들어있다면
        //cancelAnimationFrame을 해서 중복된 작업이 반복적으로 일어나지 않도록 만듬
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        //콜백에서 상태값 업데이트
        setProgress(scrollTop / height)
        //해당 값을 이용해서 가로값을 넓혀줌
      })
    }

    window.addEventListener('scroll', scroll)
    //scroll 이벤트 리스너

    return () => {
      if (rafRef.current) {
        //unmount될때도 ref의 값을 비워줌
        cancelAnimationFrame(rafRef.current)
      }

      window.removeEventListener('scroll', scroll)
      ////scroll 이벤트 리스너 해제
    }
  }, [])

  return (
    <div
      css={style}
      style={{
        transform: `scaleX(${progress})`,
        //리플로우(레이아웃 계산)를 생각해 tranform을 이용하여 가로의 값을 넓혀줌
        transformOrigin: 'left',
        backgroundColor: colors[color],
        height: 8,
      }}
    ></div>
  )
}

export default ScrollProgressBar
