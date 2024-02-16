import { useEffect, useState } from 'react'

function useDebounce<T = any>(value: T, delay = 800) {
  //value: 사용할 값, delay: 지연시간. 기본 지연시간 0.8
  //value 타입을 제너릭으로 만들어주어 값을 확장성있게 만듬
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      // setDebouncedValu가 실행되기 전에 밖에서 변화가 일어났다면 return을
      // 활용해서 timeout을 클리어해줌(value가 바뀌면서 새롭게 시작하면서 기존 timeout은 clear)
      clearTimeout(timeout)
    }
  }, [delay, value])

  return debouncedValue
}

export default useDebounce
