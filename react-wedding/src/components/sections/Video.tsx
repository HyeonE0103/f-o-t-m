import Section from '@shared/Section'
import styles from './Video.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const Video = () => {
  return (
    <Section className={cx('container')}>
      <video
        autoPlay={true}
        muted={true}
        loop={true}
        poster="/assets/poster.jpg"
      >
        {/* autoPlay는 video 태그의 옵션으로 비디오가 데이터 로드를 완료하기 위해 중지하지 않고 재생할 수 있는 가장 빠른 시점부터 재생되기 시작함
        video에서 바로 src를 주는 경우에는 autoPlay옵션을 주는 것만으로 동영상 플레이가 가능하지만
        scource태그를 같이 쓰는 경우에는 muted 옵션도 설정해주어야 함. loop옵션은 동영상이 끝나면 다시 처음부터 시작되도록 함
        동영상을 컨트롤할 수 있는 재생바 등을 나타내고 싶으면 controls 옵션을 주면 됨*/}
        <source src="/assets/main.mp4" type="video/mp4"></source>
        {/* cra같은 경우에는 '/'를 적어주게 되면 public 아래의 경로를 바라보게 됨 */}
      </video>
    </Section>
  )
}

export default Video
