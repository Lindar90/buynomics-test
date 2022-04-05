import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { timestampToStringDate } from '../../utils/dateAndTime';
import { RootState, useAppDispatch } from '../../app/store';
import { deleteIntermediary } from './intermediariesSlice';

function IntermediariesDataGrid() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const items = useSelector((state: RootState) => state.intermediaries.items);

  const columns: (GridColDef | GridActionsColDef)[] = [
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 200,
      valueFormatter(params) {
        if (typeof params.value !== 'number') throw new Error('Invalid timestamp format.');
        return timestampToStringDate(params.value);
      },
    },
    {
      field: 'name',
      flex: 1,
    },
    {
      field: 'order',
    },
    {
      field: 'actions',
      type: 'actions',
      getActions(params) {
        return [
          <GridActionsCellItem
            label="Delete"
            icon={<DeleteIcon />}
            onClick={async () => {
              dispatch(deleteIntermediary((params.id as number)));
            }}
          />,
          <GridActionsCellItem
            label="Edit"
            icon={<EditIcon />}
            onClick={() => {
              router.push(`/intermediaries/edit/${params.id}`);
            }}
          />,
        ];
      },
    },
  ];

  return (
    <DataGrid
      rows={items}
      columns={columns}
      autoHeight
      initialState={{
        sorting: {
          sortModel: [{ field: 'order', sort: 'asc' }],
        },
      }}
    />
  );
}

export default IntermediariesDataGrid;
