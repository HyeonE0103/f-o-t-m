import styles from './Share.module.scss'
import classNames from 'classnames/bind'
import Section from '@shared/Section'
import { useEffect } from 'react'
import { parseISO, format } from 'date-fns'
import { ko } from 'date-fns/locale'
import CopyToClipboard from 'react-copy-to-clipboard'

declare global {
  interface Window {
    Kakao: any
  }
}

interface ShareProps {
  groomName: string
  brideName: string
  date: string
}

const cx = classNames.bind(styles)

const Share = ({ groomName, brideName, date }: ShareProps) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js`
    script.async = true

    document.head.appendChild(script)

    script.onload = () => {
      // console.log(window)
      // window를 콘솔로 찍어보면 kakao가 준비되어있음. 사용할 함수는 init과 isInitialized
      // isInitialized는 카카오 sdk가 사용할 준비가 되었는지를 판단. boolean을 뱉음
      // init은 카카오 객체를 사용할 준비를 해주는 아이
      // 따라서 isInitialized 초기화가 되었는지 판단을하고 초기화가 되어있지 않다면 init을 사용하여 초기화를 해줄것임

      if (!window.Kakao.isInitialized()) {
        //초기화가 되어있지 않다면 초기화해줌
        window.Kakao.init(process.env.REACT_APP_KAKAO_APP_KEY)
        //kakao js key를 넣으면 객체가 활성화됨
      }
    }
  }, [])

  const handleShareKakao = () => {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${groomName} ❤ ${brideName} 결혼합니다`,
        description: `${format(parseISO(date), 'M월 d일 eeee aaa h시', { locale: ko })}`,
        imageUrl:
          'https://img.freepik.com/premium-vector/cute-asian-groom-and-bride-characters-flat-design-style-vector-illustration_540284-382.jpg',
        link: {
          mobileWebUrl: 'window.location.origin',
          //origin은 origin페이지에 프로토콜, 도메인 이름, 포트가 있을경우 포트까지 포함
          webUrl: 'window.location.origin',
        },
      },
      buttons: [
        //2개까지 가능
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: 'window.location.origin',
            //origin은 origin페이지에 프로토콜, 도메인 이름, 포트가 있을경우 포트까지 포함
            webUrl: 'window.location.origin',
          },
        },
      ],
    })
  }
  return (
    <Section title="공유하기">
      <div className={cx('wrap-share')}>
        <button onClick={handleShareKakao}>
          <KakaoIcon />
        </button>
        <CopyToClipboard
          text={window.location.origin}
          onCopy={() => {
            window.alert('복사가 완료되었습니다')
          }}
        >
          <button>
            <ClipboardIcon />
          </button>
        </CopyToClipboard>
      </div>
    </Section>
  )
}
export default Share

const KakaoIcon = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-1.363l.427-.413 1.428 2.033a.472.472 0 1 0 .773-.543l-1.514-2.155zm-2.958 1.924h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 1 0 0-.944zm-5.857-1.092l.696-1.707.638 1.707H9.092zm2.523.488l.002-.016a.469.469 0 0 0-.127-.32l-1.046-2.8a.69.69 0 0 0-.627-.474.696.696 0 0 0-.653.447l-1.661 4.075a.472.472 0 0 0 .874.357l.33-.813h2.07l.299.8a.472.472 0 1 0 .884-.33l-.345-.926zM8.293 9.302a.472.472 0 0 0-.471-.472H4.577a.472.472 0 1 0 0 .944h1.16v3.736a.472.472 0 0 0 .944 0V9.774h1.14c.261 0 .472-.212.472-.472z" />
      </g>
    </svg>
  )
}

const ClipboardIcon = () => {
  return (
    <svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <g>
        <g>
          <path d="M160,160h192c-1.7-20-9.7-35.2-27.9-40.1c-0.4-0.1-0.9-0.3-1.3-0.4c-12-3.4-20.8-7.5-20.8-20.7V78.2    c0-25.5-20.5-46.3-46-46.3c-25.5,0-46,20.7-46,46.3v20.6c0,13.1-8.8,17.2-20.8,20.6c-0.4,0.1-0.9,0.4-1.4,0.5    C169.6,124.8,161.9,140,160,160z M256,64.4c7.6,0,13.8,6.2,13.8,13.8c0,7.7-6.2,13.8-13.8,13.8c-7.6,0-13.8-6.2-13.8-13.8    C242.2,70.6,248.4,64.4,256,64.4z" />
          <path d="M404.6,63H331v14.5c0,10.6,8.7,18.5,19,18.5h37.2c6.7,0,12.1,5.7,12.4,12.5l0.1,327.2c-0.3,6.4-5.3,11.6-11.5,12.1    l-264.4,0.1c-6.2-0.5-11.1-5.7-11.5-12.1l-0.1-327.3c0.3-6.8,5.9-12.5,12.5-12.5H162c10.3,0,19-7.9,19-18.5V63h-73.6    C92.3,63,80,76.1,80,91.6V452c0,15.5,12.3,28,27.4,28H256h148.6c15.1,0,27.4-12.5,27.4-28V91.6C432,76.1,419.7,63,404.6,63z" />
        </g>
        <rect height="16" width="112" x="144" y="192" />
        <rect height="16" width="160" x="144" y="288" />
        <rect height="16" width="129" x="144" y="384" />
        <rect height="16" width="176" x="144" y="336" />
        <rect height="16" width="208" x="144" y="240" />
      </g>
    </svg>
  )
}
