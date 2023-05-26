import { yupResolver } from '@hookform/resolvers/yup';
import LoopIcon from '@mui/icons-material/Loop';
import { Grid, InputAdornment, Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProTable from 'components/ProTable';
import useRefresh from 'hooks/useRefresh';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import sleep from 'utils/sleep';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';
import useTableColumns from './TableColumns';

interface FormValues {
  note: string;
  search: string;
}

const DATA = [
  {
    id: 1,
    inDebt: false,
    product: 'Sản phẩm',
    amount: 1,
    price: 20000,
  },
  {
    id: 2,
    inDebt: false,
    product: 'Sản phẩm',
    amount: 1,
    price: 20000,
  },
  {
    id: 3,
    inDebt: false,
    product: 'Sản phẩm',
    amount: 1,
    price: 20000,
  },
];

const schema = Validation.shape({
  note: Validation.string(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  value: any;
}

const ActionProductDialog = (props: Props) => {
  const [, refetch] = useRefresh();
  const { open, onClose, value } = props;
  const { t } = useTranslation();
  const [banners] = useState<any>(DATA);
  const [loading] = useState<boolean>(false);
  const [total] = useState<number>(banners.length || 0);
  const [filters] = useState<any>({
    pageNumber: 1,
    pageSize: 25,
  });

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  useEffect(() => {
    // form.reset({ note: String(value.note) });
  }, [value, form]);

  const handleReset = async () => {
    onClose();
    await sleep(350);
    form.reset(schema.getDefault());
  };

  const handleSubmit = async (values: FormValues) => {
    handleReset();
  };

  const onPageChange = () => {};

  const onPageSizeChange = () => {};

  const { columns } = useTableColumns({
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });
  return (
    <DialogContainer open={open} onClose={handleReset} maxWidth="md">
      <ProForm<FormValues> form={form} onFinish={handleSubmit}>
        <DialogContent>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'medium',
              mb: 2,
              padding: '10px',
            }}
          >
            Thao tác với sản phẩm: Phím XSM Vàng
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              Thêm quà tặng
            </Grid>
            <Grid item xs={9}>
              <ProFormTextField
                name="search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ cursor: 'pointer' }}>
                      <LoopIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} minHeight={300}>
              <ProTable<any>
                title="Danh sách"
                loading={loading}
                columns={columns}
                data={banners}
                refetch={refetch}
                pagination={{
                  page: filters.pageNumber,
                  total,
                  pageSize: filters.pageSize,
                  onPageChange,
                  onPageSizeChange,
                }}
              />
            </Grid>
            <Grid item xs={3}>
              Ghi chú
            </Grid>
            <Grid item xs={9}>
              <ProFormTextField name="note" placeholder="" multiline rows={2} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogFooter>
          <ActionButton actionType="cancel" onClick={handleReset}>
            {t('Đóng')}
          </ActionButton>
          <ActionButton
            type="submit"
            color='success'
            disabled={TypedObject.isExist(form.formState.errors)}
          >
            {t('Áp dụng')}
          </ActionButton>
        </DialogFooter>
      </ProForm>
    </DialogContainer>
  );
};

export default ActionProductDialog;
