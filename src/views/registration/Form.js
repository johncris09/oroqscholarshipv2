import React, { useState, useEffect } from 'react'
import moment from 'moment'
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
import PropTypes from 'prop-types'
import { database, ref, get } from './../../firebase'

const Form = ({
  schoolOptions,
  courseOptions,
  courseLabel,
  gradeLevelOptions,
  gradeLabel,
  unitLabel,
  hasUnit,
  onSubmit,
  year,
  sem,
  sp_no,
}) => {
  const [validated, setValidated] = useState(false)
  const [formData, setFormData] = useState({
    year: year,
    sem: sem,
    sp_no: sp_no,
    lastname: '',
    firstname: '',
    middlename: '',
    suffix: '',
    address: '',
    birthdate: '',
    age: '',
    civil_status: '',
    sex: '',
    course: '',
    contact_number: '',
    ctc_number: '',
    facebook_other: '',
    availment: '',
    semester: '',
    year_level: '',
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_occupation: '',
    school_year: '',
    status: 'Pending',
  })
  const [barangayOptions, setBarangayOptions] = useState([])

  useEffect(() => {
    fetchBarangay()
  }, [])

  // const getAge = () => {
  //   // Calculate the age based on the current date and the birthdate in formData
  //   const birthdate = moment(formData.age, 'YYYY-MM-DD')
  //   const age = moment().diff(birthdate, 'years')
  //   console.info(age)
  //   // Update the age value in the formData state
  //   setFormData({
  //     ...formData,
  //     age: age.toString(), // Convert the age to a string for displaying in the input field
  //   })
  // }

  const generateSchoolYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const options = []

    for (let year = currentYear; year >= 2017; year--) {
      const schoolYear = `Sy: ${year}-${year + 1}`
      options.push(
        <option key={schoolYear} value={schoolYear}>
          {schoolYear}
        </option>,
      )
    }

    return options
  }

  const _table = 'barangay'
  const fetchBarangay = async () => {
    try {
      const databaseRef = ref(database, _table)
      const snapshot = await get(databaseRef)
      if (snapshot.exists()) {
        const barangays = Object.values(snapshot.val())
        setBarangayOptions(barangays)
      }
    } catch (error) {
      console.error('Error fetching barangay data:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value })

    if (name === 'birthdate') {
      const today = new Date()
      const birthdate = new Date(value)
      const ageTime = today - birthdate
      const age = Math.floor(ageTime / (1000 * 60 * 60 * 24 * 365)) // Calculating age in years
      if (age === 0) {
        setFormData({ age: '' })
      } else {
        setFormData({ age: age.toString() })
      }
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      onSubmit(formData)
    }
    setValidated(true)
    // setFormData({
    //   lastname: '',
    //   firstname: '',
    //   middlename: '',
    //   suffix: '',
    //   address: '',
    //   birthdate: '',
    //   civil_status: '',
    //   sex: '',
    //   course: '',
    //   contact_number: '',
    //   ctc_number: '',
    //   facebook_other: '',
    //   availment: '',
    //   semester: '',
    //   year_level: '',
    //   father_name: '',
    //   father_occupation: '',
    //   mother_name: '',
    //   mother_occupation: '',
    //   school_year: '',
    // })
  }

  return (
    <>
      <p className="mt-4">
        Note:{' '}
        <strong>
          <span className="text-danger">*</span> is required
        </strong>
      </p>
      <CForm
        className="row g-3 needs-validation"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <h3 className="text-danger">
            <u>{year + '-' + sem + '-' + sp_no}</u>
            <CFormInput
              type="hidden"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
            <CFormInput
              type="hidden"
              id="sem"
              name="sem"
              value={formData.sem}
              onChange={handleChange}
            />
            <CFormInput
              type="hidden"
              id="sp_no"
              name="sp_no"
              value={formData.sp_no}
              onChange={handleChange}
            />
          </h3>
        </div>
        <CCol md={4}>
          <CFormInput
            type="text"
            id="lastname"
            label={
              <>
                Last Name
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            feedbackInvalid="Last Name is required"
            required
          />
        </CCol>
        <CCol md={4}>
          <CFormInput
            type="text"
            id="firstname"
            label={
              <>
                First Name
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            feedbackInvalid="First Name is required"
            required
          />
        </CCol>
        <CCol md={2}>
          <CFormInput
            type="text"
            id="middlename"
            label={
              <>
                Middle Name
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            name="middlename"
            value={formData.middlename}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={2}>
          <CFormInput
            type="text"
            id="suffix"
            label={
              <>
                Suffix
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            name="suffix"
            value={formData.suffix}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={12}>
          <CFormSelect
            id="address"
            name="address"
            label={
              <>
                Address
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            value={formData.address}
            onChange={handleChange}
            feedbackInvalid="Date of Birth is required"
            required
          >
            <option value="">Select</option>
            {barangayOptions.map((barangay) => (
              <option key={barangay.id} value={barangay.id}>
                {barangay.barangay}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            id="birthdate"
            label={
              <>
                Date of Birth
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            feedbackInvalid="Date of Birth is required"
            required
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="datetime"
            id="age"
            label={
              <>
                Age
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            name="age"
            value={formData.age}
            onChange={handleChange}
            feedbackInvalid="Age is required"
            required
            readOnly
          />
        </CCol>
        <CCol md={3}>
          <CFormSelect
            id="civil_status"
            name="civil_status"
            value={formData.civil_status}
            onChange={handleChange}
            label={
              <>
                Civil Status
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            feedbackInvalid="Civil Status is required"
            required
          >
            <option value="">Select</option>
            <option value="Signle">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
          </CFormSelect>
        </CCol>
        <CCol md={3}>
          <CFormSelect
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            label={
              <>
                Sex
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            feedbackInvalid="Sex is required"
            required
          >
            <option value="">Select</option>
            <option value="Signle">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
          </CFormSelect>
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            id="contact_number"
            label="Contact #"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            id="ctc_number"
            label={
              <>
                CTC #
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            name="ctc_number"
            value={formData.ctc_number}
            onChange={handleChange}
            feedbackInvalid="CTC # is required"
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            id="facebook_other"
            label="Facebook/Other"
            name="facebook_other"
            value={formData.facebook_other}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            id="availment"
            label={
              <>
                Availment
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            name="availment"
            value={formData.availment}
            onChange={handleChange}
            feedbackInvalid="Availment is required"
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormSelect
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
            label={
              <>
                School Name
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            feedbackInvalid="School Name is required"
            required
          >
            <option value="">Select</option>
            {schoolOptions.map((school) => (
              <option key={school.id} value={school.id}>
                {school.school_name}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={6}>
          <CFormSelect
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            label={
              <>
                {courseLabel}
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            feedbackInvalid={courseLabel + ' is required'}
            required
          >
            <option value="">Select</option>
            {courseOptions.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={12}>
          <CFormInput
            type="text"
            id="school_address"
            label="School Address"
            name="school_address"
            value={formData.school_address}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={!hasUnit ? 4 : 3}>
          <CFormSelect
            id="year_level"
            name="year_level"
            value={formData.year_level}
            onChange={handleChange}
            label={
              <>
                {gradeLabel}
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            feedbackInvalid={gradeLabel + ' is required'}
            required
          >
            <option value="">Select</option>
            {gradeLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={!hasUnit ? 4 : 3}>
          <CFormSelect
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            label={
              <>
                Semester
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            feedbackInvalid="Semester is required"
            required
          >
            <option value="">Select</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
          </CFormSelect>
        </CCol>
        {hasUnit && (
          <CCol md={hasUnit ? 3 : 4}>
            <CFormInput
              type="text"
              id="unit"
              label={
                <>
                  {unitLabel}
                  <span className="text-warning">
                    <strong>*</strong>
                  </span>
                </>
              }
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              feedbackInvalid="Units is required"
              required
            />
          </CCol>
        )}
        <CCol md={!hasUnit ? 4 : 3}>
          <CFormSelect
            id="school_year"
            name="school_year"
            value={formData.school_year}
            onChange={handleChange}
            label={
              <>
                School Year
                <span className="text-warning">
                  <strong>*</strong>
                </span>
              </>
            }
            feedbackInvalid="School Year is required"
            required
          >
            <option value="">Select</option>
            {generateSchoolYearOptions()}
          </CFormSelect>
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            id="father_name"
            label="Father's Name"
            name="father_name"
            value={formData.father_name}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            id="father_occupation"
            label="Father's Occupation"
            name="father_occupation"
            value={formData.father_occupation}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            id="mother_name"
            label="Mother's Name"
            name="mother_name"
            value={formData.mother_name}
            onChange={handleChange}
          />
        </CCol>
        <CCol md={6}>
          <CFormInput
            type="text"
            id="mother_occupation"
            label="Mother's Occupation"
            name="mother_occupation"
            value={formData.mother_occupation}
            onChange={handleChange}
          />
        </CCol>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <CButton type="submit">Save</CButton>
        </div>
      </CForm>
    </>
  )
}

Form.propTypes = {
  schoolOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  courseOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  courseLabel: PropTypes.arrayOf(PropTypes.string).isRequired,
  gradeLevelOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  gradeLabel: PropTypes.arrayOf(PropTypes.string).isRequired,
  unitLabel: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasUnit: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default Form
