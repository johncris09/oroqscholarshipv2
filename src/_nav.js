import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBook,
  cilHome,
  cilPlus,
  cilSchool,
  cilSettings,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Scholar Registration',
    to: '/registration',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Manage Applications',
    to: '/manage',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Approved Application',
        to: '/manage/approved',
      },
      {
        component: CNavItem,
        name: 'Pending Application',
        to: '/manage/pending',
      },
      {
        component: CNavItem,
        name: 'Delete/Edit Application',
        to: '/manage/manage',
      },
      {
        component: CNavItem,
        name: 'Archived Application',
        to: '/manage/archived',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Utilities',
  },
  {
    component: CNavGroup,
    name: 'Strand/Course',
    to: '/course',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Strand',
        to: '/course/senior_high',
      },
      {
        component: CNavItem,
        name: 'College Course',
        to: '/course/college',
      },
      {
        component: CNavItem,
        name: 'TVET Course',
        to: '/course/tvet',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'School',
    to: '/school',
    icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Senior High School',
        to: '/school/senior_high',
      },
      {
        component: CNavItem,
        name: 'College School',
        to: '/school/college',
      },
      {
        component: CNavItem,
        name: 'TVET School',
        to: '/school/tvet',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Barangay',
    to: '/barangay',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'User',
    to: '/user',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _nav
