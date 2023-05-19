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
import { database, ref, get, set, update, remove, query, orderByChild } from './../../firebase'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
const MySwal = withReactContent(Swal)

const ManageTable = (status) => {
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
    console.info(status)
  }, [])

  const fetchData = async () => {
    const studentRef = query(ref(database, 'senior_high'), orderByChild('timestamp'))
    const addressRef = ref(database, 'barangay')
    const schoolRef = ref(database, 'senior_high_school')
    const strandRef = ref(database, 'shs_course')

    const studentSnapshot = await get(studentRef)
    const studentData = studentSnapshot.val()

    const addressSnapshot = await get(addressRef)
    const addressData = addressSnapshot.val()

    const schoolSnapshot = await get(schoolRef)
    const schoolData = schoolSnapshot.val()

    const strandSnapshot = await get(strandRef)
    const strandData = strandSnapshot.val()
    const result = []

    for (const studentId in studentData) {
      const student = studentData[studentId]
      const address = addressData[student.address]
      const school = schoolData[student.school]

      const strand = strandData[student.course]

      if (student.status === status.status) {
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
          course: strand.course,
          created_at: _date + '' + _time,
        }

        result.push(combinedData)
      } else {
        console.info(status.status)
      }
    }
    setData(result)
  }

  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const columns = useMemo(
    () => [
      {
        id: 'manage_table',
        columns: [
          {
            accessorKey: 'name',
            header: 'Name',
          },
          {
            accessorKey: 'address',
            header: 'Address',
          },
          {
            accessorKey: 'school',
            header: 'School',
          },
          {
            accessorKey: 'year_level',
            header: 'Grade Level',
          },
          {
            accessorKey: 'course',
            header: 'Course',
          },
          {
            accessorKey: 'created_at',
            header: 'Created At',
          },
          {
            accessorKey: 'status',
            header: 'Status',
          },
        ],
      },
    ],
    [],
  )
  return (
    <>
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
    </>
  )
}
export default ManageTable
