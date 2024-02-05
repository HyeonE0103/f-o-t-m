export interface Like {
  id: string
  hotelId: string

  hotelName: string
  hotelMainImageUrl: string
  /*이런식으로 저장하는 것보다는 hotelId만 저장해서 hotel의 Id를 기준으로
  호텔 데이터를 뽑아오는것이 좋지만 시스템의 복잡도를 낮추기 위해 호텔 정보를 같이 저장함*/

  userId: string
  order: number
}
