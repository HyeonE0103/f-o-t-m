import { useModalContext } from '@/contexts/ModalContext'
import { Wedding } from '@/models/wedding'
import React, { useEffect, useRef } from 'react'

const AttendCountModal = ({ wedding }: { wedding: Wedding }) => {
  //모달을 띄어주는 아이 무언가를 그리지는 않음
  const { open, close } = useModalContext()
  const $input = useRef<HTMLInputElement>(null)

  const havSeenModal = localStorage.getItem('@have-seen-modal')
  useEffect(() => {
    if (havSeenModal === 'true') {
      //모달을 한번 본적이 있다면 뜰 필요가 없음
      return
    }
    open({
      title: `현재 참석자: ${wedding.attendCount}`,
      body: (
        <div>
          <input
            ref={$input}
            placeholder="참석 가능 인원을 추가해주세요"
            style={{ width: '100%' }}
            type="number"
          />
        </div>
      ),
      onLeftButtononClick: async () => {
        if ($input.current) {
          await fetch('http://localhost:8888/wedding', {
            method: 'PUT',
            body: JSON.stringify({
              ...wedding,
              attendCount: wedding.attendCount + Number($input.current.value),
            }),
            headers: { 'Content-Type': 'application/json' },
          })
        }
        localStorage.setItem('@have-seen-modal', 'true')
        close()
      },
      onRightButtononClick: () => {
        localStorage.setItem('@have-seen-modal', 'true')
        close()
      },
    })
  }, [open, close, havSeenModal, wedding])
  /*의존성 배열에 open을 넣으면 무한루프. useEffect는 의존성 값이 바뀌면 Callback함수를 실행함
  open은 어떤 값을 받아서 상태값을 업데이트 함. 그러면서 해당 ModalContext가 다시 렌더링되고
  Context로 감싸져 있는 App도 다시 리렌더링되고 하위 자식도 다시 리렌더링되고
  그 안에 있는 AttendCountModal도 다시 리렌더링 됨. 그러면서 다시 open에 새값으로 useEffect 실행*/

  return null
}

export default AttendCountModal
