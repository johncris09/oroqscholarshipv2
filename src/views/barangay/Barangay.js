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
import { Box, MenuItem, Typography, ListItemIcon } from '@mui/material'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { database, ref, get, set, update, remove, push, onValue } from './../../firebase'

import { DeleteOutline, EditSharp } from '@mui/icons-material'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
const MySwal = withReactContent(Swal)

const Barangay = () => {
  const _table = 'barangay'
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [validated, setValidated] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    barangay: '',
    manager: '',
  })
  const [selectedItemId, setSelectedItemId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    const databaseRef = ref(database, _table)

    onValue(databaseRef, (snapshot) => {
      const firebaseData = snapshot.val()
      const transformedData = Object.entries(firebaseData || {}).map(([key, item]) => ({
        id: key,
        ...item,
      }))

      setData(transformedData)
    })
  }

  const handleAdd = () => {
    setFormData({
      barangay: '',
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
      const barangay = formData.get('barangay')
      if (selectedItemId) {
        // Update operation
        const itemRef = ref(database, `${_table}/${selectedItemId}`)
        update(itemRef, {
          barangay,
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
          barangay,
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
        id: 'barangay',
        columns: [
          {
            accessorKey: 'barangay',
            header: 'Barangay Name',
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
            <strong>Barangay</strong>
            <CButton color="primary" className="float-end" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlusCircle} /> Add New School
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
                      barangay: row.original.barangay,
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
          <CModalTitle>{editMode ? 'Edit Barangay' : 'Add New Barangay'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CCol md={12}>
              <CFormInput
                type="text"
                feedbackInvalid="Input is required"
                id="validationCustom01"
                label="Barangay Name"
                name="barangay"
                value={formData.barangay}
                onChange={(e) => handleInputChange(e)}
                required
              />
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
export default Barangay
