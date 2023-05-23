import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import Form from './Form'
import {
  database,
  ref,
  get,
  push,
  set,
  serverTimestamp,
  query,
  orderByChild,
  onValue,
} from './../../firebase'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const Registration = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [validated, setValidated] = useState(false)
  const [schoolTable, setSchoolTable] = useState('senior_high_school')
  const [courseTable, setCourseTable] = useState('shs_course')

  const [schoolOptions, setSchoolOptions] = useState([])
  const [courseOptions, setCourseOptions] = useState([])
  const [hasUnit, setHasUnit] = useState(false)

  const [tableSubmit, setTableSubmit] = useState('senior_high')
  const [spNo, setSpNo] = useState()
  const [currentYear, setCurrentYear] = useState()
  const [currentSemester, setCurrentSemester] = useState()

  const handleNavClick = (key) => {
    setActiveKey(key)

    // Update the table value based on the selected key
    let school_table = ''
    let course_table = ''
    if (key === 1) {
      school_table = 'senior_high_school'
      course_table = 'shs_course'
      setTableSubmit('senior_high')
      fetchSpNo('senior_high')
      setHasUnit(false)
    } else if (key === 2) {
      school_table = 'college_school'
      course_table = 'college_course'
      setTableSubmit('college')
      fetchSpNo('college')
      setHasUnit(true)
    } else if (key === 3) {
      school_table = 'tvet_school'
      setTableSubmit('tvet')
      fetchSpNo('tvet')
      setHasUnit(true)
      course_table = 'tvet_course'
    }

    fetchSchool(school_table)
    fetchCourse(course_table)
  }

  useEffect(() => {
    fetchSchool(schoolTable)
    fetchCourse(courseTable)
    fetchSpNo(tableSubmit)

    const currentYear = new Date().getFullYear() // Get the current year
    setCurrentYear(currentYear)
    setCurrentSemester(2)
  }, [])

  const fetchSpNo = async (tableSubmit) => {
    try {
      const dataRef = query(ref(database, tableSubmit), orderByChild('sp_no'))

      onValue(dataRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = []
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val()
            data.push(childData)
          })

          // Filter the data based on the desired year
          const filteredData = data.filter((item) => {
            const year = parseInt(item.year, 10)
            const semester = parseInt(item.sem, 10)
            return year === currentYear && semester === currentSemester
          })

          const maxSpNo = filteredData.reduce((max, item) => {
            return item.sp_no > max ? item.sp_no : max
          }, 0)

          const parsedMaxSpNo = parseInt(maxSpNo, 10)
          const nextSpNo = isNaN(parsedMaxSpNo) ? 1 : parsedMaxSpNo + 1
          setSpNo(nextSpNo)
        }
      })

      // Fetch the initial data
      const snapshot = await get(dataRef)
      if (snapshot.exists()) {
        const data = []
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val()
          data.push(childData)
        })

        // Filter the data based on the desired year
        const filteredData = data.filter((item) => {
          const year = parseInt(item.year, 10)
          return year === currentYear
        })

        const maxSpNo = filteredData.reduce((max, item) => {
          return item.sp_no > max ? item.sp_no : max
        }, 0)

        const parsedMaxSpNo = parseInt(maxSpNo, 10)
        const nextSpNo = isNaN(parsedMaxSpNo) ? 1 : parsedMaxSpNo + 1

        setSpNo(nextSpNo)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchSchool = async (_table) => {
    try {
      const databaseRef = ref(database, _table)
      const snapshot = await get(databaseRef)
      if (snapshot.exists()) {
        const school = Object.values(snapshot.val())
        setSchoolOptions(school)
      }
    } catch (error) {
      console.error('Error fetching school data:', error)
    }
  }

  const fetchCourse = async (_table) => {
    try {
      const databaseRef = ref(database, _table)
      const snapshot = await get(databaseRef)
      if (snapshot.exists()) {
        const course = Object.values(snapshot.val())
        setCourseOptions(course)
      }
    } catch (error) {
      console.error('Error fetching barangay data:', error)
    }
  }

  const handleSubmit = (formData) => {
    const timestamp = serverTimestamp()
    const newItemRef = push(ref(database, tableSubmit))
    const id = newItemRef.key
    set(newItemRef, {
      id,
      timestamp,
      ...formData,
    })
      .then(() => {
        MySwal.fire({
          title: <strong>Success!</strong>,
          html: <i>New Record Successfully Added!</i>,
          icon: 'success',
        })
        fetchSpNo(tableSubmit)
      })
      .catch((error) => {
        console.error('Error adding data:', error)
      })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Scholarship Registration</strong>
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
                <Form
                  onSubmit={handleSubmit}
                  schoolOptions={schoolOptions}
                  courseOptions={courseOptions}
                  courseLabel={'Strand'}
                  gradeLevelOptions={['Grade 11', 'Grqade 12']}
                  gradeLabel={'Grade Level'}
                  hasUnit={false}
                  unitLabel={''}
                  year={currentYear}
                  sem={currentSemester}
                  spNo={spNo}
                />
              </CTabPane>
              <CTabPane visible={activeKey === 2}>
                <Form
                  onSubmit={handleSubmit}
                  schoolOptions={schoolOptions}
                  courseOptions={courseOptions}
                  courseLabel={'Course'}
                  gradeLevelOptions={['I', 'II', 'III', 'IV', 'V']}
                  gradeLabel={'Year Level'}
                  hasUnit={true}
                  unitLabel={'Units'}
                  year={currentYear}
                  sem={currentSemester}
                  spNo={spNo}
                />
              </CTabPane>
              <CTabPane visible={activeKey === 3}>
                <Form
                  onSubmit={handleSubmit}
                  schoolOptions={schoolOptions}
                  courseOptions={courseOptions}
                  courseLabel={'Course'}
                  gradeLevelOptions={['I', 'II', 'III', 'IV', 'V']}
                  gradeLabel={'Year Level'}
                  hasUnit={true}
                  unitLabel={'No. of Hours'}
                  year={currentYear}
                  sem={currentSemester}
                  spNo={spNo}
                />
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Registration
