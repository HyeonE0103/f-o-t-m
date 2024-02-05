import { useEffect } from 'react'

declare global {
  interface Window {
    Kakao: any
  }
}

export const useLoadKakao = () => {
  useEffect(() => {
    const script = document.createElement('script')
    //script 태그 만들기
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js'
    script.async = true

    document.head.appendChild(script)
    //head에 태그 추가

    script.onload = () => {
      if (!window.Kakao.isInitialized()) {
        //window에 있는 Kakao가 초기화가 되지 않은 상태라면
        window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY)
        //초기화
      }
    }
  }, [])
}

export default useLoadKakao
