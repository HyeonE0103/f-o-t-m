import Alert from '@shared/Alert'
import React, {
  ComponentProps,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

type AlertProps = ComponentProps<typeof Alert>
//주저리 적을 필요 없이 Component에서 Props빼오기
type AlertOptions = Omit<AlertProps, 'open'>
//Omit을 이용하여 open을 제외한 타입 정의

interface AlertContextValue {
  open: (options: AlertOptions) => void
}

const Context = createContext<AlertContextValue | undefined>(undefined)

const defaultValues: AlertProps = {
  open: false,
  title: null,
  description: null,
  onButtonClick: () => {},
}

export function AlertContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [alertState, setAlertState] = useState(defaultValues)

  const $portal_root = document.getElementById('root-portal')

  const close = useCallback(() => {
    setAlertState(defaultValues)
  }, [])

  const open = useCallback(
    ({ onButtonClick, ...options }: AlertOptions) => {
      setAlertState({
        ...options,
        onButtonClick: () => {
          close()
          onButtonClick()
        },
        open: true,
      })
    },
    [close],
  )

  const values = useMemo(() => ({ open }), [open])

  return (
    <Context.Provider value={values}>
      {children}
      {$portal_root != null
        ? createPortal(<Alert {...alertState} />, $portal_root)
        : null}
    </Context.Provider>
  )
}

export function useAlertContext() {
  const values = useContext(Context)

  if (values == null) throw new Error('AlertContext 내부에서 사용해주세요')

  return values
}
