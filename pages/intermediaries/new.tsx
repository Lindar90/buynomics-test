import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { IntermediaryType } from '../../features/intermediaries/IIntermediaryService.types';
import { useAppDispatch } from '../../app/store';
import { addIntermediary } from '../../features/intermediaries/intermediariesSlice';
import { isValidDecimal, isValidStep } from '../../utils/validationRules';
import IntermediaryForm, { IFilledItem, INewItem } from '../../features/intermediaries/IntermediaryForm';

function IntermediaryNew() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const defaultData = {
    name: '',
    order: undefined,
    type: undefined,
    from: undefined,
    to: undefined,
    step: undefined,
    options: [],
  };

  const onSubmit = (item: IFilledItem) => {
    dispatch(addIntermediary(item));
    router.push('/');
  };

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

  return (
    <Box
      sx={{
        padding: '50px',
      }}
    >
      <h2>Add new Intermediary</h2>

      <IntermediaryForm
        defaultData={defaultData}
        onSubmit={onSubmit}
        rules={rules}
      />
    </Box>
  );
}

export default IntermediaryNew;
