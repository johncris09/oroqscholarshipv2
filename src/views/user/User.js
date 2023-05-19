import React, { useEffect, useState, useMemo } from 'react'
import MaterialReactTable from 'material-react-table'
import RefreshIcon from '@mui/icons-material/Refresh'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { Box, MenuItem, ListItemIcon, IconButton, Tooltip } from '@mui/material'
import { database, ref, get, set, update, onValue } from './../../firebase'
import {
  AccountCircle,
  Check,
  CheckBox,
  Close,
  DeleteOutline,
  PendingActions,
  Send,
} from '@mui/icons-material'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const User = () => {
  const _table = 'users'
  const [data, setData] = useState([])
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
                  {cell.getValue() === 'Pending' && <PendingActions />}
                  {cell.getValue() === 'Approved' && <Check />}
                  {cell.getValue() === 'Disapproved' && <Close />}
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
              renderTopToolbarCustomActions={() => (
                <Tooltip arrow title="Refresh Data">
                  <IconButton onClick={fetchData}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              )}
              renderRowActionMenuItems={({ row, closeMenu }) => [
                row.original.roleType === 'SuperAdmin' ? null : row.original.status ===
                  'Pending' ? (
                  <MenuItem
                    key={0}
                    onClick={() => {
                      console.info(row.original)
                      closeMenu()
                      MySwal.fire({
                        title: 'Confirm Approval',
                        text: 'Are you sure you want to approve the user?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, approved it!',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          // Update operation
                          const itemRef = ref(database, `${_table}/${row.original.id}`)
                          update(itemRef, {
                            status: 'Approved',
                          })
                            .then(() => {
                              MySwal.fire(
                                'User Approved!',
                                'The user has been successfully approved.',
                                'success',
                              )
                            })
                            .catch((error) => {
                              MySwal.fire('User Approved!', 'Error updating user status.', 'error')
                            })
                          fetchData()
                        }
                      })
                    }}
                    sx={{ m: 0 }}
                  >
                    <ListItemIcon>
                      <CheckBox />
                    </ListItemIcon>
                    Approved
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={0}
                    onClick={() => {
                      console.info(row.original)
                      closeMenu()
                      MySwal.fire({
                        title: 'Confirm Disapproval',
                        text: 'Are you sure you want to disapprove the user?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, disapproved it!',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          // Update operation
                          const itemRef = ref(database, `${_table}/${row.original.id}`)
                          update(itemRef, {
                            status: 'Disapproved',
                          })
                            .then(() => {
                              MySwal.fire(
                                'User Dispproved!',
                                'The user has been successfully disapproved.',
                                'success',
                              )
                            })
                            .catch((error) => {
                              MySwal.fire(
                                'User Disapproved!',
                                'Error updating user status.',
                                'error',
                              )
                            })
                          fetchData()
                        }
                      })
                    }}
                    sx={{ m: 0 }}
                  >
                    <ListItemIcon>
                      <Close />
                    </ListItemIcon>
                    Disapproved
                  </MenuItem>
                ),
                <MenuItem
                  key={1}
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
                  key={2}
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
