import { yupResolver } from '@hookform/resolvers/yup';
import { Divider, Grid, Paper, Tab, Tabs, Typography, Link, Button } from '@mui/material';
import ActionButton from 'components/ProButton/ActionButton';
import DialogContainer from 'components/ProDialog/DialogContainer';
import DialogContent from 'components/ProDialog/DialogContent';
import DialogFooter from 'components/ProDialog/DialogFooter';
import ProForm from 'components/ProForm';
import TabPanel from '@mui/lab/TabPanel';
import Page from 'components/Page';
import type { SyntheticEvent } from 'react';
import { read, utils, writeFile } from 'xlsx';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TypedObject from 'utils/TypedObject';
import Validation from 'utils/Validation';
import SelectPriceList from './SelectPriceList';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormAutocomplete from 'components/ProForm/Label/ProFormAutocomplete';
import UploadInput from 'components/UploadInput';

interface FormValues {
  [key: string]: any;
}

const schema = Validation.shape({
  priceTable: Validation.string().optional(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  value: number;
  // confirmChange: any;
}

const tabs = [
  {
    label: 'Thêm sản phẩm',
    value: '0',
    component: <Typography>Thêm sản phẩm</Typography>,
  },
  {
    label: 'Nhập từ Exel',
    value: '1',
    component: <SelectPriceList />,
  },
];

const ImportProductToPriceList = (props: Props) => {
  const { open, onClose, value } = props;
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>("1")

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  useEffect(() => {
    form.reset({

    });
  }, [value, form]);

  const handleReset = () => {
    onClose();
  };

  const handleSubmit = async (values: FormValues) => {

    console.log('values', values);

    // handleReset();
    // confirmChange(values);
  };

  const handleChange = (_event: SyntheticEvent, tab: string) => {
    console.log('tab', tab);
    setTab(tab)
  }

  const onSelectFile = ($event: any) => {
    const files = $event.target.files;

    console.log('files', files);

    if (files?.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        console.log('sheets', sheets);


        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          console.log('rows', rows);

          // setMovies(rows)
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <DialogContainer maxWidth="lg" open={open} onClose={handleReset}>
      <ProForm<FormValues> form={form} onFinish={handleSubmit}>
        <DialogContent>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'medium',
              mb: 2,
            }}
          >
            Chọn sản phẩm áp dụng
          </Typography>
          <Divider />
          <Paper
            sx={{
              display: 'grid',
              gridTemplateRows: 'auto auto 1fr',
              borderRadius: 0,
            }}
          >
            <Tabs
              value={tab}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabs.map((tab, i) => (
                <Tab
                  key={i}
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: 'none' }}
                    >
                      {tab.label}
                    </Typography>
                  }
                  value={tab.value}
                />
              ))}
              {/* {tabs.map((tab, i) => (
                <TabPanel key={i} value={tab.value} sx={{ p: 0 }}>
                  {tab.component}
                </TabPanel>
              ))} */}
              {/* <Paper sx={{ p: 3 }}> */}

              {/* </Paper> */}
            </Tabs>
          </Paper>
          {tab === '1' ? (
            <>
              <Grid container alignItems="center" mt={2}>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                  <ProFormLabel
                    sx={{ textAlign: 'center' }}
                    name="selectPrice"
                    title="Chọn bảng giá"
                    required
                  />
                </Grid>
                <Grid item xs={8} sm={8} md={8} lg={8}>
                  <ProFormAutocomplete
                    name="priceTable"
                    options={[
                      {
                        id: '00000000-0000-0000-0000-000000000000',
                        name: 'Bảng giá mặc định',
                      },
                    ]}
                    placeholder="Bảng giá"
                    renderLabel={(option) => option?.name}
                    renderValue={(option) => option?.id}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center" justifyContent="center" mt={2}>
                <Grid item xs={12} sm={12} lg={12}>
                  <ProFormLabel
                    sx={{ textAlign: 'center' }}
                    name="product"
                    title="Thêm sản phẩm từ file exel"
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <Typography sx={{ textAlign: 'center' }}>Tải về <Link>file mẫu</Link></Typography>
                </Grid>
                <Button variant="contained" component="label" sx={{ mt: 1 }}>
                  Upload
                  <UploadInput
                    accept="text/plain, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={onSelectFile}
                  />
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12} md={12}>
              <Typography>Đang phát triển</Typography>
            </Grid>
          )}

        </DialogContent>
        <DialogFooter>
          <ActionButton actionType="cancel" onClick={handleReset}>
            {t('Đóng')}
          </ActionButton>
          <ActionButton
            type="submit"
            disabled={TypedObject.isExist(form.formState.errors)}
          >
            {t('Xác nhận')}
          </ActionButton>
        </DialogFooter>
      </ProForm>
    </DialogContainer >
  );
};

export default ImportProductToPriceList;
