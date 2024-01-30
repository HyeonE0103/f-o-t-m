import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

import { FormValues } from '@/models/signup'
import Form from '@components/signup/Form'

import { auth, store } from '@/remote/firebase'
import { collection, doc, setDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/constants'

const SignupPage = () => {
  const handleSubmit = async (formValues: FormValues) => {
    const { email, password, name } = formValues
    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(user, { displayName: name })
    //만들어진 user를 가져와 displayName을 업데이트

    const newUser = {
      //인증된 유저를 가지고 인증된 유저의 uid로 store에 있는 유저의 정보를 가져올 수 있음
      uid: user.uid,
      email: user.email,
      displayName: name,
    }

    await setDoc(doc(collection(store, COLLECTIONS.USER), user.uid), newUser)
    //firestore이 지정한 id가 아닌 id를 직접 지정
  }

  return (
    <div>
      <Form onSubmit={handleSubmit} />
    </div>
  )
}

export default SignupPage
