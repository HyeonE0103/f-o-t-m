import Link from 'next/link'
import Spacing from '@shared/Spacing'

function Link2Page() {
  return (
    <div>
      Link2Page
      <Spacing size={1000} />
      <Link href="/link/3" prefetch={false}>
        {/* prefetch를 false로 놓으면 원래 뷰포트에 보이면 가져왔을때와 다르게
      커서가 해당 요소에 올라가면 prefetch를 함 */}
        Link2로 이동
      </Link>
    </div>
  )
}

export default Link2Page
