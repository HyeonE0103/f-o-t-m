import { Hotel } from '@/models/hotel'
import React from 'react'
import Flex from '@shared/Flex'
import Text from '@shared/Text'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const Map = ({ location }: { location: Hotel['location'] }) => {
  const {
    directions,
    pointGeolocation: { x, y },
  } = location

  const { isLoaded } = useJsApiLoader({
    //JS로드해서 사용준비가 되면 Map을 그려줌
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API as string,
    //googleMapsApiKey가 string 형식이라 string이라고 명시해주어야 ts오류 안남
  })

  if (isLoaded === false) {
    //로드가 되지 않았다면 아무것도 안보여줌
    return null
  }

  return (
    <Flex direction="column" style={{ padding: '24px' }}>
      <Text typography="t4" bold={true}>
        기본 정보
      </Text>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '250px',
          margin: '16px 0',
          boxSizing: 'border-box',
        }}
        center={{
          //호텔위치를 가운데로 지도 띄움
          lat: y,
          lng: x,
        }}
        zoom={15}
      >
        <Marker position={{ lat: y, lng: x }} />
        {/* 핀포인트로 마커 추가 */}
      </GoogleMap>
      <Text typography="t6">{directions}</Text>
    </Flex>
  )
}

export default Map
