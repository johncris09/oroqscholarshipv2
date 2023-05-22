import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import ManageTable from '../ManageTable'

import { database, ref, get, set, update, remove, query, orderByChild } from './../../../firebase'
const Approved = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [validated, setValidated] = useState(false)
  const [schoolTable, setSchoolTable] = useState('senior_high_school')
  const [courseTable, setCourseTable] = useState('shs_course')

  const [schoolOptions, setSchoolOptions] = useState([])
  const [courseOptions, setCourseOptions] = useState([])
  const [hasUnit, setHasUnit] = useState(false)
  const [data, setData] = useState([])
  const defaultTable = 'senior_high'

  useEffect(() => {
    setData([])
    fetchData('senior_high', 'shs_course', 'senior_high_school')
  }, [])

  const handleNavClick = (key) => {
    setActiveKey(key)

    // Update the table value based on the selected key
    let school_table = ''
    let course_table = ''
    let table = defaultTable
    if (key === 1) {
      school_table = 'senior_high_school'
      course_table = 'shs_course'
      table = 'senior_high'
      setHasUnit(false)
    } else if (key === 2) {
      school_table = 'college_school'
      course_table = 'college_course'
      table = 'college'
      setHasUnit(true)
    } else if (key === 3) {
      school_table = 'tvet_school'
      setHasUnit(true)
      school_table = 'tvet_school'
      course_table = 'tvet_course'
      table = 'tvet'
    }
    // setTable(table)
    fetchData(table, course_table, school_table)
  }

  const fetchData = async (table, course_table, school_table) => {
    const studentRef = query(ref(database, table), orderByChild('timestamp'))
    const addressRef = ref(database, 'barangay')
    const schoolRef = ref(database, school_table)
    const courseRef = ref(database, course_table)

    const studentSnapshot = await get(studentRef)
    const studentData = studentSnapshot.val()

    const addressSnapshot = await get(addressRef)
    const addressData = addressSnapshot.val()

    const schoolSnapshot = await get(schoolRef)
    const schoolData = schoolSnapshot.val()

    const courseSnapshot = await get(courseRef)
    const courseData = courseSnapshot.val()
    const result = []
    for (const studentId in studentData) {
      const student = studentData[studentId]
      const address = addressData[student.address]
      const school = schoolData[student.school]

      const studentCourse = courseData[student.course]

      const approved = [
        'Approved',
        'Additional Approved',
        'Additional Approved 1',
        'Additional Approved 2',
        'Additional Approved 3',
        'Additional Approved 4',
        'Additional Approved 5',
        'Additional Approved 6',
        'Additional Approved 7',
        'Additional Approved 8',
      ]
      if (approved.includes(student.status)) {
        const date = new Date(student.timestamp)
        const formattedDate = date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })

        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        const _date = formattedDate == 'Invalid Date' ? '' : formattedDate
        const _time = formattedTime == 'Invalid Date' ? '' : formattedTime
        const combinedData = {
          id: student.id,
          name:
            titleCase(student.lastname + ', ' + student.firstname + ' ' + student.middlename) +
            ' ' +
            student.suffix,
          address: address ? address.barangay : null,
          school: school ? school.school_name : null,
          year_level: student.year_level,
          status: student.status,
          course: studentCourse.course,
          created_at: _date + '' + _time,
        }

        result.push(combinedData)
      } else {
        // console.info(status)
      }
    }
    setData(result)
    // console.info(data)
  }
  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Approved</strong>
          </CCardHeader>
          <CCardBody>
            <CNav variant="pills" layout="justified">
              <CNavItem>
                <CNavLink active={activeKey === 1} onClick={() => handleNavClick(1)}>
                  Senior High School
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeKey === 2} onClick={() => handleNavClick(2)}>
                  College
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeKey === 3} onClick={() => handleNavClick(3)}>
                  TVET
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane visible={activeKey === 1}>
                <ManageTable _data={data} status={'Approved'} />
              </CTabPane>
              <CTabPane visible={activeKey === 2}>
                <ManageTable _data={data} status={'Approved'} />
              </CTabPane>
              <CTabPane visible={activeKey === 3}>
                <ManageTable _data={data} status={'Approved'} />
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Approved
