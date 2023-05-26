import { yupResolver } from '@hookform/resolvers/yup';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ProForm from 'components/ProForm';
import Validation from 'utils/Validation';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { AddSupplierProduct } from './utils/types';
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import ProFormContent from 'components/ProForm/ProFormContent';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ActionButton from 'components/ProButton/ActionButton';
import { useState } from 'react';

const validationSchema = yup.object().shape({
  supllierName: Validation.string(),
  productName: Validation.string(),
});

const AddSupplierTable = () => {
  const [radioValue, setRadioValue] = useState<string>('1');
  const form = useForm<AddSupplierProduct>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const handleSubmit = (value: any) => {
    console.log(value);
  };

  const handleChangeRadio = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setRadioValue(value);
  };

  return (
    <PageWrapper title="Thêm sản phẩm nhà cung cấp">
      <PageBreadcrumbs
        title="Thêm sản phẩm nhà cung cấp"
        items={[{ link: '/products/supplier', text: 'Danh sách nhà cung cấp' }]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <ProFormContent>
          <Paper sx={{ p: 2, mt: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                mb: 1,
              }}
            >
              <Stack sx={{ alignItems: 'center' }}>
                <ErrorOutlineIcon />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {'Thông tin'}
                </Typography>
              </Stack>
            </Box>
            <Divider />
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={12} lg={6}>
                <ProFormTextField
                  name="supplierName"
                  label="Tên nhà cung cấp"
                  placeholder="Nhà cung cấp"
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <ProFormTextField
                  name="productName"
                  placeholder="Tên sản phẩm"
                  label="Tên sản phẩm"
                />
              </Grid>
            </Grid>
            <Typography mt={1} variant="subtitle2">
              Sau khi lưu dữ liệu:
            </Typography>
            <FormControl>
              <RadioGroup row value={radioValue} onChange={handleChangeRadio}>
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Tiếp tục thêm"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Hiện danh sách"
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </ProFormContent>
        <Stack spacing={2} mt={2}>
          <ActionButton
            actionType="save"
            variant="contained"
            type="submit"
            sx={{ backgroundColor: '#4CAF50 ' }}
          >
            Lưu
          </ActionButton>
        </Stack>
      </ProForm>
    </PageWrapper>
  );
};

export default AddSupplierTable;
