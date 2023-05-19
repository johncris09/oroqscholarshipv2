import { initializeApp } from 'firebase/app'

import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDcbnP7_Cs-ujnQunX5BbSLBgQmxQWUfis',
  authDomain: 'oroqscholarship-bea3c.firebaseapp.com',
  databaseURL: 'https://oroqscholarship-bea3c-default-rtdb.firebaseio.com',
  projectId: 'oroqscholarship-bea3c',
  storageBucket: 'oroqscholarship-bea3c.appspot.com',
  messagingSenderId: '843269546085',
  appId: '1:843269546085:web:6fbb75909079192baca68c',
  measurementId: 'G-FV3VYGWHK6',
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }
