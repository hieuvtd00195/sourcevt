import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Divider, Grid, Typography } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import ProFormAutocomplete from 'components/ProForm/ProFormAutocomplete';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import sleep from 'utils/sleep';
import Validation from 'utils/Validation';

interface IForm {
  store: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  // value?: any;
}

const schema = Validation.shape({
  store: Validation.string().optional(),
});

const SelectedStoreDialog = (props: Props) => {
  const { open, onClose } = props;
  const { t } = useTranslation();

  const form = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleReset = async () => {
    onClose();
    await sleep(350);
  };

  const handleSubmit = async (data: IForm) => {
    handleReset()
  };

  return (
    <DialogContainer open={open} maxWidth="sm">
      <ProForm
        form={form}
        onFinish={handleSubmit}
      >
        <DialogContent>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'medium',
              mb: 2,
              padding: '10px',
            }}
          >
            Chọn cửa hàng
          </Typography>
          <Box>
            <Divider />
          </Box>

          <Grid container spacing={1} sx={{marginTop: 1}}>
            <Grid item xs={3}>
              Cửa hàng
            </Grid>
            <Grid item xs={9}>
              <ProFormAutocomplete
                name="store"
                placeholder={t('Chọn cửa hàng')}
                options={[
                  { value: 1, label: 'TM' },
                  { value: 2, label: 'HN-1' },
                  { value: 3, label: 'HN-2' },
                  { value: 4, label: 'Sài Gòn' },
                  { value: 5, label: 'VTech Thanh Hóa' },
                ]}
                renderLabel={(option) => option.label}
                renderValue={(option) => option.value}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogFooter>
          {/* <ActionButton actionType="cancel" onClick={handleReset}>
          {t('Không')}
        </ActionButton> */}
          <ActionButton type="submit" color="success">
            {t('Có')}
          </ActionButton>
        </DialogFooter>
      </ProForm>
    </DialogContainer>
  );
};

export default SelectedStoreDialog;
