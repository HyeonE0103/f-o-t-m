import { useCallback } from 'react'

// const share = useShare()

interface shareProps {
  title: string
  description: string
  imageUrl: string
  buttonLabel: string
}

//return을 handleShare해주고 있기 때문에 const share = useShare() 사용
const useShare = () => {
  const handleShare = useCallback(
    ({ title, description, imageUrl, buttonLabel }: shareProps) => {
      window.Kakao.Share.sendDefault({
        objectType: 'feed', //type은 피드로
        content: {
          title,
          description,
          imageUrl,
          link: {
            mobileWebUrl: window.location.href, //지금 공유되고 있는 페이지를 그대로 가져갈수 있도록
            webUrl: window.location.href, //origin을 넣으면 출처로 뜨기때문에 정확한 정보를 위해 href로 넣어줌
          },
        },
        buttons: [
          {
            title: buttonLabel,
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      })
    },
    [],
  )

  return handleShare
}

export default useShare
