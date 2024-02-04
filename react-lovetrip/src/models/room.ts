export interface Room {
  avaliableCount: number
  basicInfo: {
    [key: string]: string | number
    //key는 string이지만 값은 string이거나 number일수 있음
  }
  imageUrl: string
  price: number
  refundable: boolean
  roomName: string
}
