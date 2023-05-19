import React, { useState, useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import Login from 'src/views/pages/login/Login'
import { TroubleshootOutlined } from '@mui/icons-material'
import { database, provider, ref, set, auth, signInWithPopup, push } from './../firebase'

const DefaultLayout = () => {
  const [visible, setVisible] = useState(false)
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // User is authenticated
        setUser(currentUser)
      } else {
        // User is not authenticated
        setUser(null)
      }
    })

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [])

  return (
    <div>
      {!user ? (
        <Login />
      ) : (
        <>
          <AppSidebar />
          <div className="wrapper d-flex flex-column min-vh-100 bg-light">
            <AppHeader />
            <div className="body flex-grow-1 px-3">
              <AppContent />
            </div>
            <AppFooter />
          </div>
        </>
      )}
    </div>
  )
}

export default DefaultLayout
