import React, { useEffect, useState, useMemo } from 'react'
import MaterialReactTable from 'material-react-table'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { MenuItem, ListItemIcon } from '@mui/material'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { database, ref, get, set, update, remove, push } from './../../../firebase'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
const MySwal = withReactContent(Swal)

const TvetCourse = () => {
  const _table = 'tvet_course'
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [validated, setValidated] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    course: '',
    manager: '',
  })
  const [selectedItemId, setSelectedItemId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const databaseRef = ref(database, _table)
    const snapshot = await get(databaseRef)
    const firebaseData = snapshot.val()
    const transformedData = Object.entries(firebaseData || {}).map(([key, item]) => ({
      id: key,
      ...item,
    }))
    setData(transformedData)
  }

  const handleAdd = () => {
    setFormData({
      course: '',
      manager: '',
    })
    setEditMode(false)
    setVisible(true)
    setSelectedItemId(null)
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      const formData = new FormData(form)
      const course = formData.get('course')
      const manager = formData.get('manager')
      if (selectedItemId) {
        // Update operation
        const itemRef = ref(database, `${_table}/${selectedItemId}`)
        update(itemRef, {
          course,
          manager,
        })
          .then(() => {
            MySwal.fire({
              title: <strong>Success!</strong>,
              html: <i>Record Successfully Updated!</i>,
              icon: 'success',
            })
          })
          .catch((error) => {
            console.error('Error updating data:', error)
          })
      } else {
        // Add operation
        const newItemRef = push(ref(database, _table))
        const id = newItemRef.key
        set(newItemRef, {
          id,
          course,
          manager,
        })
          .then(() => {
            MySwal.fire({
              title: <strong>Success!</strong>,
              html: <i>New Record Successfully Added!</i>,
              icon: 'success',
            })
          })
          .catch((error) => {
            console.error('Error adding data:', error)
          })
      }
      setValidated(false)
      setVisible(false)
    }
    fetchData()
    form.reset()
    setValidated(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const columns = useMemo(
    () => [
      {
        id: 'tvet_course',
        columns: [
          {
            accessorKey: 'course',
            enableClickToCopy: true,
            header: 'Course Name',
          },
          {
            accessorKey: 'manager',
            enableClickToCopy: true,
            header: 'Manager',
          },
        ],
      },
    ],
    [],
  )
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>TVET Course</strong>
            <CButton color="primary" className="float-end" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlusCircle} /> Add New Course
            </CButton>
          </CCardHeader>
          <CCardBody>
            <MaterialReactTable
              columns={columns}
              data={data}
              enableColumnFilterModes
              enableColumnOrdering
              enableGrouping
              enablePinning
              enableRowActions
              initialState={{ density: 'compact' }}
              positionToolbarAlertBanner="bottom"
              renderRowActionMenuItems={({ closeMenu, row }) => [
                <MenuItem
                  className="text-warning"
                  key={0}
                  onClick={() => {
                    closeMenu()
                    setFormData({
                      course: row.original.course,
                      manager: row.original.manager,
                    })
                    setSelectedItemId(row.original.id) // Set the selected item ID
                    setVisible(true)
                    setEditMode(true)
                  }}
                  sx={{ m: 0 }}
                >
                  <ListItemIcon>
                    <EditSharp className="text-warning" />
                  </ListItemIcon>
                  Edit
                </MenuItem>,
                <MenuItem
                  className="text-danger"
                  key={1}
                  onClick={() => {
                    closeMenu()
                    Swal.fire({
                      title: 'Are you sure?',
                      text: "You won't be able to revert this!",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, delete it!',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        const itemRef = ref(database, `${_table}/${row.original.id}`)
                        remove(itemRef)
                        fetchData()
                        Swal.fire('Deleted!', 'Data has been deleted.', 'success')
                      }
                    })
                  }}
                  sx={{ m: 0 }}
                >
                  <ListItemIcon>
                    <DeleteOutline className="text-danger" />
                  </ListItemIcon>
                  Delete
                </MenuItem>,
              ]}
            />
          </CCardBody>
        </CCard>
      </CCol>

      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
        backdrop="static"
        keyboard={false}
      >
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Course' : 'Add New Course'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
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
            <CCol md={12}>
              <CFormInput
                type="text"
                feedbackInvalid="Course Name is required"
                id="course-name"
                label={
                  <>
                    Course Name
                    <span className="text-warning">
                      <strong>*</strong>
                    </span>
                  </>
                }
                name="course"
                value={formData.course}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </CCol>
            <CCol md={12}>
              <CFormSelect
                feedbackInvalid="Manager is required"
                id="manager"
                label={
                  <>
                    Manager
                    <span className="text-warning">
                      <strong>*</strong>
                    </span>
                  </>
                }
                name="manager"
                value={formData.manager}
                onChange={(e) => handleInputChange(e)}
                required
              >
                <option disabled>Choose...</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </CFormSelect>
            </CCol>
            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {editMode ? 'Update' : 'Submit form'}
              </CButton>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>
    </CRow>
  )
}
export default TvetCourse
