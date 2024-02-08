import { initializeApp, getApp, getApps } from 'firebase/app'

import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const app =
  getApps().length > 0
    ? //getApps를 사용해서 초기화되어있는 app이 있는지 확인하여 있다면 초기화되어있는 App 사용
      getApp()
    : initializeApp({
        //app 초기화
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_AUTO_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGEING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
      })

export const auth = getAuth(app)
export const store = getFirestore(app)
