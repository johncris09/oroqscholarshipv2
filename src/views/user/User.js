import React, { useEffect, useRef, useState, useMemo } from 'react'
import MaterialReactTable from 'material-react-table'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import { Box, MenuItem, Typography, ListItemIcon } from '@mui/material'

import { database, ref, get, set, update, remove, push } from './../../firebase'

import { AccountCircle, Send } from '@mui/icons-material'
const data = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    avatar:
      'https://lh3.googleusercontent.com/a/AGNmyxaZUcHf6li9ouZpHc3ZJnOCpk0io5f_jw2HAIf6Kw=s96-c',
    email: 'john.doe@example.com',
    salary: 50000,
    jobTitle: 'Software Engineer',
    startDate: '2021-01-01',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    avatar:
      'https://lh3.googleusercontent.com/a/AGNmyxaZUcHf6li9ouZpHc3ZJnOCpk0io5f_jw2HAIf6Kw=s96-c',
    email: 'jane.smith@example.com',
    salary: 75000,
    jobTitle: 'Project Manager',
    startDate: '2020-06-15',
  },
  // Add more data objects as needed
]
const User = () => {
  const _table = 'users'
  const [data, setData] = useState([])

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

  const columns = useMemo(
    () => [
      {
        id: 'user',
        columns: [
          {
            accessorFn: (row) => `${row.displayName}`,
            id: 'name',
            header: 'Name',
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <img
                    alt="avatar"
                    height={30}
                    src={row.original.photoURL}
                    loading="lazy"
                    style={{ borderRadius: '50%' }}
                  />
                  {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                  <span>{renderedCellValue}</span>
                </Box>
              </>
            ),
          },
          {
            accessorKey: 'email',
            enableClickToCopy: true,
            header: 'Email',
            size: 300,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <>
                <Box
                  component="span"
                  sx={(theme) => ({
                    backgroundColor:
                      cell.getValue() === 'Pending'
                        ? theme.palette.warning.dark
                        : cell.getValue() === 'Disapproved'
                        ? theme.palette.error.dark
                        : theme.palette.primary.dark,
                    borderRadius: '0.25rem',
                    color: '#fff',
                    maxWidth: '9ch',
                    p: '0.25rem',
                  })}
                >
                  {cell.getValue()}
                </Box>
              </>
            ),
          },
          {
            accessorKey: 'roleType',
            enableClickToCopy: true,
            header: 'Role',
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
            <strong>User</strong>
            {/* <CButton color="primary" className="float-end" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlusCircle} /> Add New User
            </CButton> */}
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
              renderRowActionMenuItems={({ closeMenu }) => [
                <MenuItem
                  key={0}
                  onClick={() => {
                    // View profile logic...
                    closeMenu()
                  }}
                  sx={{ m: 0 }}
                >
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  View Profile
                </MenuItem>,
                <MenuItem
                  key={1}
                  onClick={() => {
                    // Send email logic...
                    closeMenu()
                  }}
                  sx={{ m: 0 }}
                >
                  <ListItemIcon>
                    <Send />
                  </ListItemIcon>
                  Send Email
                </MenuItem>,
              ]}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
export default User
