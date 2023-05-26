import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import Grid from '@mui/material/Grid';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiltersRef } from 'types/refs';
import Validation from 'utils/Validation';
import type { FilterParams } from './utils/filters';

interface FilterValues {
  id: string;
  supplier: string;
  product: string;
}

const schema = Validation.shape({
  id: Validation.string().optional(),
  supplier: Validation.string().optional(),
  product: Validation.string().optional(),
});

interface Props {
  onSearch: (params: Partial<FilterParams>) => void;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSearch } = props;
  const { t } = useTranslation();
  const [loop, setLoop] = useState<boolean>(false);
  const [parentProduct, setParentProduct] = useState<boolean>(false);

  const form = useForm<FilterValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: FilterValues) => {
    const { ...rest } = values;
    onSearch({
      ...rest,
    });
  };

  const handleReset = () => {
    form.reset(schema.getDefault());
  };

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    submit: form.handleSubmit(handleSubmit),
  }));

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      PaperProps={{ sx: { padding: '16px 16px 0 16px' } }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} lg={0.8}>
          <ProFormTextField
            name="id"
            placeholder={t('ID')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <ProFormTextField
            name="supplier"
            placeholder={t('Nhà cung cấp')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sm={2}
          md={2}
          lg={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ ml: 1 }}
                  size="medium"
                  color="secondary"
                  checked={loop}
                  onChange={() => setLoop((prev) => !prev)}
                />
              }
              label="Lặp"
            />
          </FormGroup>
        </Grid>
        <Grid
          item
          xs={6}
          sm={2}
          md={2}
          lg={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ ml: 1 }}
                  size="medium"
                  color="secondary"
                  checked={parentProduct}
                  onChange={() => setParentProduct((prev) => !prev)}
                />
              }
              label="SP cha"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={1.5}>
          <ProFormTextField
            name="product"
            placeholder={t('Sản phẩm')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={1.5}>
          <Button variant="contained" size="medium" type="submit">
            Lọc
          </Button>
        </Grid>
      </Grid>
    </ProForm>
  );
});

export default FiltersForm;
