import { useModalContext } from '@/contexts/MocalContext'
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
  }, []) // eslint-disable-line

  return null
}

export default AttendCountModal
