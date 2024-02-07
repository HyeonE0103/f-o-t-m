import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useCallback } from 'react'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

import { auth, store } from '@remote/firebase'
import { COLLECTIONS } from '@constants'
import { FirebaseError } from 'firebase/app'

const useGoogleSignin = () => {
  const navigate = useNavigate()

  const signin = useCallback(async () => {
    const provider = new GoogleAuthProvider()

    try {
      const { user } = await signInWithPopup(auth, provider)
      //user에는 방금 로그인 요청한 유저의 정보(displayName, email, uid 등이 들어있음)

      const userSnapshot = await getDoc(
        doc(collection(store, COLLECTIONS.USER), user.uid),
      )

      if (!userSnapshot.exists()) {
        // 가입한 유저가 아닌 경우
        const 새로운유저 = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }

        await setDoc(
          doc(collection(store, COLLECTIONS.USER), user.uid),
          //USER라는 콜렉션에 새로운유저 문서를 만드는데 id값은 user.uid로
          새로운유저,
        )
      }
      navigate('/') //회원가입했던 유저라면 바로 내보내고 아니면 회원가입 시킴
    } catch (error) {
      if (error instanceof FirebaseError) {
        //방출된 에러가 FirebaseError일때
        if (error.code === 'auth/popup-closed-by-user') {
          //구글 로그인 팝업이 로그인안하고 창 닫았을때 오류가 방출되어서 무시
          return
        }
      }

      throw new Error('fail to signin')
      //그외에 에러는 밖으로 던짐
    }
  }, [navigate])

  const signout = useCallback(() => {
    signOut(auth)
  }, [])

  return { signin, signout } //useGoogleSignin훅으로 로그인과 로그아웃
}

export default useGoogleSignin
