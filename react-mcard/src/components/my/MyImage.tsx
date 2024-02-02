import { ChangeEvent } from 'react'
import styled from '@emotion/styled'
import { getAuth, updateProfile } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, doc, updateDoc } from 'firebase/firestore'
import { useSetRecoilState } from 'recoil'

import { app, storage, store } from '@remote/firebase'
import useUser from '@hooks/auth/useUser'
import { userAtom } from '@atoms/user'
import { COLLECTIONS } from '@/constants'

function MyImage({
  size = 40,
  mode = 'default',
}: {
  size?: number
  mode?: 'default' | 'upload'
}) {
  const user = useUser() //인증된 유저를 가지고 status에 가지고 있는 값
  const setUser = useSetRecoilState(userAtom)

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    console.log('files', files)

    const currentUser = getAuth(app).currentUser
    //db와 firebase가 상호작용하기 위해 인증된 유저에 대한 정보를 가지고 옴
    //실제 firebase에 동작하고 있는 유저의 정보

    if (files == null || user == null || currentUser == null) {
      //파일, 로그인한 유저, firebase에 동작하고 있는 유저의 정보 중 하나라도 없다면 아무런 일도 일어나지 않음
      return
    }

    const fileName = files[0].name //업로드한 파일의 이름
    const storageRef = ref(storage, `users/${user.uid}/${fileName}`)
    //storage를 사용하겠고 이런 경로로 넣을꺼야

    const uploaded = await uploadBytes(storageRef, files[0])
    //첫전째 인자로 ref넣고 두번째 인자로 어떤 파일을 넣을껀지, 최종결과 정보

    const downloadUrl = await getDownloadURL(uploaded.ref)
    //방금 업로드된 uploaded의 ref를 가져와 사용, 최종결과 주소(url)

    await updateProfile(currentUser, {
      //누구에게 어떤 값을 업데이트 할것인지(auth)
      photoURL: downloadUrl,
    })

    await updateDoc(doc(collection(store, COLLECTIONS.USER), currentUser.uid), {
      //DB에 유저 정보 업데이트, 해당 uid를 가지고 있는 문서가져와 이미지 업로드
      photoURL: downloadUrl,
    })

    setUser({
      //전역관리에 있는 유저내용 업데이트
      ...user,
      photoURL: downloadUrl,
    })
  }

  return (
    /*결국 사이즈를 props으로 주어 유저 이미지와 관련된 곳에 사용하는 Image태그를 만드는 것
    Navbar에 이미지를 눌렀을 경우에도 업로드를 하면 이상하니 mod를 값을 주어
    mod가 upload 일 경우만 뒤에 input을 숨겨 이미지를 업로드 할 수 있도록 함*/
    <Container>
      <img
        src={
          //유저의 포토이미지가 았다면 유저이미지를 아니면 defaultImage
          user?.photoURL ||
          'https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-64.png'
        }
        alt="유저의 이미지"
        width={size}
        height={size}
      />
      {mode === 'upload' ? (
        <input type="file" accept="image/*" onChange={handleUploadImage} />
      ) : null}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  & img {
    border-radius: 100%;
  }

  & input[type='file'] {
    //input중에 type이 파일이라면
    position: absolute; //absolute로 띄어줌(relative기준으로 위치를 맞춤)
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0; //안보이게
    cursor: pointer;
  }
`

export default MyImage
