function addDelimiter(value: number | string, delimiter = ',') {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter)
  //정규식을 사용해서 3자리마다 밖에서 넘겨주는 구분자를 찍어주는 함수
}

export default addDelimiter
