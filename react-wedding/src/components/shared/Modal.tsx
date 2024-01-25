import styles from './Modal.module.scss'
import classNames from 'classnames/bind'
import Dimmed from './Dimmed'

const cx = classNames.bind(styles)

interface ModalProps {
  open: boolean
  title?: string
  body: React.ReactNode
  rightButtonLabel?: string
  onRightButtononClick: () => void
  leftButtonLabel?: string
  onLeftButtononClick: () => void
}
const Modal = ({
  open,
  title,
  body,
  rightButtonLabel = '닫기',
  onRightButtononClick,
  leftButtonLabel = '확인',
  onLeftButtononClick,
}: ModalProps) => {
  return (
    <>
      {open && (
        <Dimmed>
          <div className={cx('wrap-modal')}>
            <div className={cx('wrap-body')}>
              <div className={cx('wrap-content')}>
                {title && <div className={cx('txt-title')}>{title}</div>}
                {body}
              </div>
              <div className={cx('wrap-buttons')}>
                <button onClick={onLeftButtononClick}>{leftButtonLabel}</button>
                <button onClick={onRightButtononClick}>
                  {rightButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </Dimmed>
      )}
    </>
  )
}

export default Modal
