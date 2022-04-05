import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { GetServerSideProps } from 'next';
import IIntermediaryService, {
  Intermediary,
  IntermediaryType,
} from '../../../features/intermediaries/IIntermediaryService.types';
import fakeIntermediaryService from '../../../features/intermediaries/FakeIntermediaryService';
import IntermediaryForm, { INewItem } from '../../../features/intermediaries/IntermediaryForm';
import { isValidDecimal, isValidStep } from '../../../utils/validationRules';

const intermediaryService: IIntermediaryService = fakeIntermediaryService;

export const getServerSideProps: GetServerSideProps = async (context) => ({ props: {} });

function IntermediaryEdit() {
  const [isLoading, setIsLoading] = useState(false);
  const [editItem, setEditItem] = useState<Intermediary | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchItem = async () => {
      const { id } = router.query;

      if (!id) throw new Error('Id not found.');

      setIsLoading(true);

      const item = await intermediaryService.getById(parseInt((id as string), 10));

      // console.log(item);

      setEditItem(item);
      setIsLoading(false);
    };

    fetchItem();
  }, []);

  if (isLoading || !editItem) {
    return <LinearProgress />;
  }

  const rules = {
    name: (value?: string) => {
      if (!value) return 'Name is required.';
      if (value.length > 255) return 'Name can be max 255 characters.';

      return undefined;
    },

    order: (value?: number) => {
      if (!value) return 'Order is required.';

      return undefined;
    },

    type: (value?: IntermediaryType) => {
      if (!value) return 'Type is required.';

      return undefined;
    },

    from: (value: number | undefined, item: INewItem) => {
      if (item.type === IntermediaryType.RANGE) {
        if (!value) return 'From is required.';

        if (!isValidDecimal(value)) return 'Max 6 digits after the decimal point.';

        if (item.to && value > item.to) return `From cannot be more then ${item.to}.`;
      }

      return undefined;
    },

    to: (value: number | undefined, item: INewItem) => {
      if (item.type === IntermediaryType.RANGE) {
        if (!value) return 'To is required.';

        if (!isValidDecimal(value)) return 'Max 6 digits after the decimal point.';

        if (item.from && value <= item.from) return `To cannot be less then ${item.from}.`;
      }

      return undefined;
    },

    step: (value: number | undefined, item: INewItem) => {
      if (item.type === IntermediaryType.RANGE) {
        if (!value) return 'Step is required.';

        if (!isValidDecimal(value)) return 'Max 6 digits after the decimal point.';

        if (item.from && item.to && !isValidStep(value, item.from, item.to)) return 'Invalid step.';
      }

      return undefined;
    },
  };

  const onSubmit = async (item: Intermediary) => {
    await intermediaryService.update(item);
    router.push('/');
  };

  return (
    <Box
      sx={{
        padding: '50px',
      }}
    >
      <h2>Edit Intermediary</h2>

      <IntermediaryForm
        defaultData={editItem}
        onSubmit={onSubmit}
        rules={rules}
      />
    </Box>
  );
}

export default IntermediaryEdit;
