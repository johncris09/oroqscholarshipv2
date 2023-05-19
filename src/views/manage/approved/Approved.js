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

const Approved = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [validated, setValidated] = useState(false)
  const [schoolTable, setSchoolTable] = useState('senior_high_school')
  const [courseTable, setCourseTable] = useState('shs_course')

  const [schoolOptions, setSchoolOptions] = useState([])
  const [courseOptions, setCourseOptions] = useState([])
  const [hasUnit, setHasUnit] = useState(false)

  const handleNavClick = (key) => {
    setActiveKey(key)

    // Update the table value based on the selected key
    let school_table = ''
    let course_table = ''
    if (key === 1) {
      school_table = 'senior_high_school'
      course_table = 'shs_course'
      setHasUnit(false)
    } else if (key === 2) {
      school_table = 'college_school'
      course_table = 'college_course'
      setHasUnit(true)
    } else if (key === 3) {
      school_table = 'tvet_school'
      setHasUnit(true)
      course_table = 'tvet_course'
    }
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
                <ManageTable status={'Approved'} />
              </CTabPane>
              <CTabPane visible={activeKey === 2}>
                <ManageTable status={'Approved'} />
              </CTabPane>
              <CTabPane visible={activeKey === 3}>
                <ManageTable status={'Approved'} />
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Approved
