import Modal from '@shared/Modal'
import {
  createContext,
  useContext,
  ComponentProps,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { createPortal } from 'react-dom'

type ModalProps = ComponentProps<typeof Modal>
//ComponentProps를 사용하면 이렇게 Modal에 props를 추출할 수 있음

type ModalOptions = Omit<ModalProps, 'open'>
//Omit이라는 함수를 이용해서 ModalProps에서 'open'을 제외함

interface ModalContextValue {
  open: (options: ModalOptions) => void
  //open이라는 동작은 모달을 여는 것
  close: () => void
}

const Context = createContext<ModalContextValue | undefined>(undefined)

const defaultValues = {
  open: false,
  body: null,
  onRightButtononClick: () => {},
  onLeftButtononClick: () => {},
}

export function ModalContext({ children }: { children: React.ReactNode }) {
  //ModalContext는 Modal를 품음
  const [modalState, setModalState] = useState<ModalProps>(defaultValues)

  const $portal_root = document.getElementById('portal_root')

  const open = useCallback((options: ModalOptions) => {
    setModalState({ ...options, open: true })
    //위에서 options에 open이 제외되어 있기 때문에 따로 open:true로 넣어줌
  }, [])
  /*open은 따로 바깥값에 영향을 받지 않음. 파라미터를 넘겨받아 파라미터를 state로 업데이트
  따라서 한번 만들어지면 그대로 캐시해서 사용해도 되는 함수임*/

  const close = useCallback(() => {
    //defaultValues로 바꾸어 모달 닫음(open:false)
    setModalState(defaultValues)
  }, [])

  const values = useMemo(
    () => ({
      open,
      close,
    }),
    [open, close],
  )

  return (
    <Context.Provider value={values}>
      {/* ContextApi는 계속 상태가 업데이트 되면서 하위 자식을 다 렌더링 시킴 */}
      {children}
      {$portal_root != null
        ? createPortal(<Modal {...modalState} />, $portal_root)
        : null}
    </Context.Provider>
  )
}

export const useModalContext = () => {
  const values = useContext(Context)
  //context의 value 가져옴

  if (values == null) {
    //Context를 사용하기 위해서는 최상단에 Context를 감싸주어야 하는데 감싸주지 않았을 예외 경우
    throw new Error('ModalContext 안에서 사용해주세요')
  }

  return values
}
