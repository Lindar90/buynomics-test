import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  FormControl, InputLabel, MenuItem,
} from '@mui/material';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { IntermediaryType } from './IIntermediaryService.types';
import { isValidDecimal } from '../../utils/validationRules';

export interface INewItem {
  name: string,
  order?: number,
  type?: IntermediaryType,
  from?: number,
  to?: number,
  step?: number,
  options: { option: string, value: number }[],
}

export interface IFilledItem {
  name: string,
  order: number,
  type: IntermediaryType,
  from?: number,
  to?: number,
  step?: number,
  options: { option: string, value: number }[],
}

interface IProps {
  defaultData: INewItem | IFilledItem,

  onSubmit: (data: IFilledItem) => void,

  rules: {
    [key: string]: (value: any, item: IFilledItem | INewItem) => string | undefined
  }
}

function IntermediaryForm({ defaultData, onSubmit, rules }: IProps) {
  const [item, setItem] = useState(defaultData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    Object.keys(rules).forEach((key) => {
      const validate = rules[(key as keyof INewItem)];
      if (validate) {
        const error = validate(item[key as keyof INewItem], item);

        if (error) {
          newErrors[key] = error;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      return;
    }

    onSubmit((item as IFilledItem));
  };

  const onTextInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  const onNumberInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setItem({
      ...item,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const [newOption, setNewOption] = useState({ option: '', value: '' });
  const [newOptionErrors, setNewOptionErrors] = useState<{ [key: string]: string }>({});

  const onNewOptionChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewOption({
      ...newOption,
      [e.target.name]: e.target.value,
    });
  };

  const onAddNewOption = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!newOption.option) {
      newErrors.option = 'Option is required';
    }

    if (!newOption.value) {
      newErrors.value = 'Option is required';
    }

    if (!isValidDecimal(parseFloat(newOption.value))) {
      newErrors.value = 'Max 6 digits after the decimal point.';
    }

    setNewOptionErrors(newErrors);

    if (Object.keys(newErrors).length) {
      return;
    }

    setItem({
      ...item,
      options: [
        ...item.options,
        newOption,
      ],
    });

    setNewOption({ option: '', value: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="name"
        name="name"
        label="Name"
        value={item.name}
        onChange={onTextInputChange}
        error={Boolean(errors.name)}
        helperText={Boolean(errors.name) && errors.name}
        sx={{ marginTop: '20px' }}
        fullWidth
      />

      <TextField
        id="order"
        name="order"
        label="Order"
        value={item.order}
        onChange={onNumberInputChange}
        error={Boolean(errors.order)}
        helperText={Boolean(errors.order) && errors.order}
        sx={{ marginTop: '20px' }}
        type="number"
        fullWidth
      />

      <FormControl
        fullWidth
        sx={{ marginTop: '20px' }}
      >
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          name="type"
          label="Type"
          value={item.type}
          onChange={onTextInputChange}
          error={Boolean(errors.type)}
        >
          <MenuItem value={IntermediaryType.RANGE}>Range</MenuItem>
          <MenuItem value={IntermediaryType.DROPDOWN}>Dropdown</MenuItem>
        </Select>
      </FormControl>

      {item.type === IntermediaryType.RANGE && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            id="from"
            name="from"
            label="From"
            value={item.from}
            onChange={onNumberInputChange}
            error={Boolean(errors.from)}
            helperText={Boolean(errors.from) && errors.from}
            sx={{ marginTop: '20px' }}
            type="number"
          />

          <TextField
            id="to"
            name="to"
            label="To"
            value={item.to}
            onChange={onNumberInputChange}
            error={Boolean(errors.to)}
            helperText={Boolean(errors.to) && errors.to}
            sx={{ marginTop: '20px' }}
            type="number"
          />

          <TextField
            id="step"
            name="step"
            label="Step"
            value={item.step}
            onChange={onNumberInputChange}
            error={Boolean(errors.step)}
            helperText={Boolean(errors.step) && errors.step}
            sx={{ marginTop: '20px' }}
            type="number"
          />
        </Box>
      )}

      {item.type === IntermediaryType.DROPDOWN && (
        <div>
          <DataGrid
            columns={[{ field: 'option', flex: 1 }, { field: 'value', flex: 1 }]}
            rows={item.options}
            sx={{ marginTop: '20px' }}
            getRowId={(i) => JSON.stringify(i)}
            autoHeight
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: '20px' }}>
            <TextField
              id="option"
              name="option"
              label="Option"
              value={newOption.option}
              onChange={onNewOptionChange}
              error={Boolean(newOptionErrors.option)}
              helperText={Boolean(newOptionErrors.option) && newOptionErrors.option}
              sx={{ marginTop: '20px' }}
            />

            <TextField
              id="value"
              name="value"
              label="Value"
              value={newOption.value}
              onChange={onNewOptionChange}
              error={Boolean(newOptionErrors.value)}
              helperText={Boolean(newOptionErrors.value) && newOptionErrors.value}
              sx={{ marginTop: '20px' }}
              type="number"
            />

            <Button
              variant="outlined"
              sx={{ marginTop: '20px' }}
              onClick={onAddNewOption}
            >
              Add option
            </Button>
          </Box>
        </div>
      )}

      <Button variant="contained" type="submit" sx={{ marginTop: '20px' }}>
        Save
      </Button>
    </form>
  );
}

export default IntermediaryForm;
