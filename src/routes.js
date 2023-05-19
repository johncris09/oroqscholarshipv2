import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Registration = React.lazy(() => import('./views/registration/Registration'))
const SeniorHighStrand = React.lazy(() => import('./views/course/senior_high/SeniorHighStrand'))
const CollegeCourse = React.lazy(() => import('./views/course/college/CollegeCourse'))
const TvetCourse = React.lazy(() => import('./views/course/tvet/TvetCourse'))

const User = React.lazy(() => import('./views/user/User'))
// Manage
const Approved = React.lazy(() => import('./views/manage/approved/Approved'))
const Pending = React.lazy(() => import('./views/manage/pending/Pending'))
const Manage = React.lazy(() => import('./views/manage/manage/Manage'))
const Archived = React.lazy(() => import('./views/manage/archived/Archived'))

const SeniorHighSchool = React.lazy(() => import('./views/school/senior_high/SeniorHighSchool'))
const CollegeSchool = React.lazy(() => import('./views/school/college/CollegeSchool'))
const TvetSchool = React.lazy(() => import('./views/school/tvet/TvetSchool'))

const Barangay = React.lazy(() => import('./views/barangay/Barangay'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/registration', name: 'Scholarship Registration', element: Registration },

  { path: '/user', name: 'user', element: User },
  { path: '/manage', name: 'Manage Appilcation', element: Approved, exact: true },
  { path: '/manage/approved', name: 'Approved', element: Approved },
  { path: '/manage/pending', name: 'Pending', element: Pending },
  { path: '/manage/manage', name: 'Manage', element: Manage },
  { path: '/manage/archived', name: 'Archived', element: Archived },
  { path: '/course', name: 'Course', element: SeniorHighStrand, exact: true },
  { path: '/course/senior_high', name: 'Senior High School Strand', element: SeniorHighStrand },
  { path: '/course/college', name: 'College Course', element: CollegeCourse },
  { path: '/course/tvet', name: 'TVET Course', element: TvetCourse },

  { path: '/school', name: 'School', element: SeniorHighSchool, exact: true },
  { path: '/school/senior_high', name: 'Senior High School', element: SeniorHighSchool },
  { path: '/school/college', name: 'College School', element: CollegeSchool },
  { path: '/school/tvet', name: 'TVET School', element: TvetSchool },
  { path: '/barangay', name: 'Barangay', element: Barangay },

  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
]

export default routes
