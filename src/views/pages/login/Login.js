import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import {
  database,
  ref,
  get,
  set,
  update,
  remove,
  signInWithPopup,
  auth,
  push,
  provider,
} from './../../../firebase'
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons'
import logo from './../../../assets/images/logo.png'

const checkUserExists = async (email) => {
  try {
    const usersRef = ref(database, 'users')
    const usersSnapshot = await get(usersRef)
    const users = usersSnapshot.val()
    if (!users) {
      return false
    }
    for (const userId in users) {
      if (users[userId].email === email) {
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Error checking user existence:', error)
    throw error
  }
}

const saveUserData = async (user) => {
  try {
    const userData = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      status: 'Pending',
      roleType: 'User',
    }
    const usersRef = ref(database, 'users')
    const emailExists = await checkUserExists(user.email)
    if (!emailExists) {
      const newUserRef = push(usersRef)
      await set(newUserRef, userData)
      console.log('User data saved successfully')
    } else {
      console.log('User already exists')
    }
  } catch (error) {
    console.error('Error saving user data:', error)
    throw error
  }
}

// Set up the Google authentication handler
const handleGoogleAuth = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const { user } = result

    checkUserExists(user.email)
      .then((exists) => {
        if (exists) {
          console.log('User exists')
          // Perform actions for existing user
        } else {
          console.log('User does not exist')
          // Perform actions for non-existing user
          saveUserData(user)
        }
      })
      .catch((error) => {
        console.error('Error checking user existence:', error)
      })
  } catch (error) {
    console.error('Error authenticating with Google:', error)
  }
}

const Login = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <div className="text-center">
                    <CImage rounded src={logo} width={200} height={200} />
                  </div>
                  <CForm>
                    <h1 className="text-center">Login</h1>
                    <p className="text-medium-emphasis text-center">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Email" autoComplete="Email" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12}>
                        <div className="d-grid gap-2 col-12 mx-auto">
                          <CButton color="primary" shape="rounded-pill" size="md">
                            Button
                          </CButton>
                        </div>
                        <p className="text-medium-emphasis text-center my-3">Or connect with</p>
                        <div className="d-grid my-2 col-12 mx-auto">
                          <GoogleLoginButton onClick={handleGoogleAuth} />
                        </div>
                        <div className="d-grid my-2 col-12 mx-auto">
                          <FacebookLoginButton onClick={() => alert('Hello')} />
                        </div>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
