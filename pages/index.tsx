import { useEffect } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Link from 'next/link';
import IntermediariesDataGrid from '../features/intermediaries/IntermediariesDataGrid';
import { RootState, useAppDispatch } from '../app/store';
import { fetchIntermediaries } from '../features/intermediaries/intermediariesSlice';

function IntermediariesList() {
  const dispatch = useAppDispatch();
  const isLoading = useSelector((state: RootState) => state.intermediaries.isLoading);

  useEffect(() => {
    dispatch(fetchIntermediaries());
  }, [dispatch]);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Intermediaries list</h2>

        <Link href="/intermediaries/new">
          <Button variant="contained">Add new</Button>
        </Link>
      </Box>

      <IntermediariesDataGrid />
    </>
  );
}

export default IntermediariesList;
