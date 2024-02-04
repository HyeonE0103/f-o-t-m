const formatTime = (ms: number) => {
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  //일,시,분을 초로 환산

  const days = Math.floor(ms / day)
  //해당 초가 몇일정도 되는지 계산

  // 핫딜 종료
  if (days < 0) {
    return ''
  }

  const 남은시간 = Math.floor((ms - days * day) / hour)
  const 남은분 = Math.floor((ms - days * day - 남은시간 * hour) / minute)
  const 남은초 = Math.floor(
    (ms - days * day - 남은시간 * hour - 남은분 * minute) / 1000,
  )

  const HH = `${남은시간}`.padStart(2, '0')
  //자리수에 맞춰서 두번째 인자로 받은 문자를 앞에서부터 채워줌, (3,'*')이라면 0 => **0
  const mm = `${남은분}`.padStart(2, '0')
  const SS = `${남은초}`.padStart(2, '0')

  return days > 0 ? `${days}일 ${HH}:${mm}:${SS}` : `${HH}:${mm}:${SS}`
}

export default formatTime
