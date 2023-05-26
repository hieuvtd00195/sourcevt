import { Grid } from '@mui/material';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ICreateSettingPriceListType } from '../utils/type';
import InfoIcon from '@mui/icons-material/Info';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import ProDateRange from 'components/ProDateTime/ProDateRange';
import ProFormCheckboxSelect from 'components/ProForm/ProFormCheckboxSelect';

interface Props {
  form: UseFormReturn<ICreateSettingPriceListType>;
}

const Infomation = (props: Props) => {
  const { form } = props;
  const { t } = useTranslation();
  return (
    <ProForm form={form}>
      <ProFormContent m={2}>
        <ProFormHeader>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={6} md={4} lg={8}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <InfoIcon sx={{ marginRight: '8px' }} color="inherit" />
                Thông tin
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <ProFormSelect
                name="status"
                placeholder={t('Trạng thái')}
                options={[
                  { value: 1, label: 'Hoạt động' },
                  { value: 2, label: 'Không hoạt động' },
                ]}
                renderLabel={(option) => option.label}
                renderValue={(option) => option.value}
              />
            </Grid>
          </Grid>
        </ProFormHeader>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          mt={1}
        >
          <Grid item xs={12} sm={12} md={10} lg={11}>
            <ProFormTextField
              name="priceName"
              placeholder={t('Tên bảng giá')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={11}>
            <ProDateRange
              label={t('Ngày áp dụng')}
              from="applyStartDate"
              to="applyEndDate"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={11}>
            <ProFormCheckboxSelect
              name="category"
              label={t('Danh mục')}
              placeholder={t('Chọn danh mục')}
              options={[
                { value: 1, label: 'Chưa gắn danh mục' },
                { value: 2, label: 'Vỏ' },
                { value: 3, label: 'Vỏ Độ' },
                { value: 4, label: 'Pin ZIN' },
                { value: 5, label: 'Lõi Pin' },
                { value: 6, label: 'Pin EU' },
                { value: 7, label: 'Màn hình' },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={11}>
            <ProFormTextField
              name="note"
              placeholder={t('Ghi chú')}
              InputLabelProps={{ shrink: true }}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </ProFormContent>
    </ProForm>
  );
};

export default Infomation;
