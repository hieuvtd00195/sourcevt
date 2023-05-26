import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import ProForm from 'components/ProForm';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormHeader from 'components/ProForm/ProFormHeader';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ICreateSettingPriceListType, ISelectButtonType, ISelectUnitType } from '../utils/type';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';

interface Props {
  form: UseFormReturn<ICreateSettingPriceListType>;
}

const AdvancedSetting = (props: Props) => {
  const { form } = props;
  const { t } = useTranslation();

  const [isAutoSettingPrice, setIsAutoSettingPrice] = useState<boolean>(false);
  const [isWarning, setWarning] = useState<boolean>(true);
  const [isAutoUpdate, setIsAutoUpdate] = useState<boolean>(false);
  const [isSelectButton, setIsSelectButton] = useState<ISelectButtonType>({
    add: true,
    deduction: false,
  });
  const [isSelectUnit, setIsSelectUnit] = useState<ISelectUnitType>({
    VND: true,
    percent: false,
  });

  const onChangeAutoSettingPrice = () => {
    setIsAutoSettingPrice(!isAutoSettingPrice);
  };

  const onChangeWarning = () => {
    setWarning(!isWarning);
  };

  const onChangeAutoUpdate = () => {
    setIsAutoUpdate(!isAutoUpdate);
  };

  const onClickAdd = () => {
    setIsSelectButton({
      add: true,
      deduction: false,
    });
  };

  const onClickDeducation = () => {
    setIsSelectButton({
      add: false,
      deduction: true,
    });
  };

  const onClickVND = () => {
    setIsSelectUnit({
      VND: true,
      percent: false,
    });
  };

  const onClickPercent = () => {
    setIsSelectUnit({
      VND: false,
      percent: true,
    });
  };

  return (
    <ProForm form={form}>
      <ProFormContent m={2} mb={4}>
        <ProFormHeader>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={12} md={10} lg={11}>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <SettingsSuggestIcon
                  sx={{ marginRight: '8px' }}
                  color="inherit"
                />
                Thiết lập nâng cao
              </div>
            </Grid>
          </Grid>
        </ProFormHeader>
        <Stack
          direction="row"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Grid container spacing={2} ml={6} width="60%" mb={2} mt={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAutoSettingPrice}
                      color="success"
                      size="medium"
                      onChange={onChangeAutoSettingPrice}
                    />
                  }
                  label="Thiết lập giá tự động"
                />
              </FormGroup>
            </Grid>

            <Collapse in={isAutoSettingPrice} timeout="auto">
              <Box mt={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} mt={2}>
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    flexDirection="row"
                  >
                    <Typography width="50%">Giá mới =</Typography>

                    <ProFormSelect
                      name="newPriceSelect"
                      placeholder={t('Giá bán lẻ')}
                      options={[
                        { value: 1, label: 'Giá bán lẻ' },
                        { value: 2, label: 'Giá bán sỉ' },
                        { value: 3, label: 'Giá nhập' },
                        { value: 4, label: 'Giá vốn' },
                      ]}
                      renderLabel={(option) => option.label}
                      renderValue={(option) => option.value}
                      fullWidth
                      sx={{ minWidth: '120px' }}
                    />
                    <Button
                      color={isSelectButton.add ? 'info' : 'inherit'}
                      sx={{ ml: '8px' }}
                      onClick={onClickAdd}
                    >
                      +
                    </Button>
                    <Button
                      color={isSelectButton.deduction ? 'info' : 'inherit'}
                      sx={{ ml: '8px', mr: '8px' }}
                      onClick={onClickDeducation}
                    >
                      -
                    </Button>
                    <ProFormTextField
                      name="newPrice"
                      InputLabelProps={{ shrink: true }}
                    />
                    <Button
                      color={isSelectUnit.VND ? 'info' : 'inherit'}
                      sx={{ ml: '8px' }}
                      size="small"
                      onClick={onClickVND}
                    >
                      VND
                    </Button>
                    <Button
                      color={isSelectUnit.percent ? 'info' : 'inherit'}
                      sx={{ ml: '8px' }}
                      onClick={onClickPercent}
                    >
                      %
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} ml={1} mt={2} mb={2}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isAutoUpdate}
                          color="success"
                          size="small"
                          onChange={onChangeAutoUpdate}
                        />
                      }
                      label="Tự động cập nhật bảng giá khi giá sản phẩm thay đổi"
                    />
                  </FormGroup>
                </Grid>
              </Box>
            </Collapse>
          </Grid>
          <Grid container spacing={2} ml={6} width="50%">
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isWarning}
                      color="success"
                      size="medium"
                      onChange={onChangeWarning}
                    />
                  }
                  label="Cảnh báo khi bán hàng"
                />
              </FormGroup>
            </Grid>

            <Collapse in={isWarning} timeout="auto">
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio color="info" />}
                    label="Cho phép chọn hàng hóa khác bảng giá"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio color="info" />}
                    label="Cho phép chọn hàng hóa khác bảng giá kèm cảnh báo"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio color="info" />}
                    label="Không cho phép chọn hàng hóa khác bảng giá"
                  />
                </RadioGroup>
              </FormControl>
            </Collapse>
          </Grid>
        </Stack>
      </ProFormContent>
    </ProForm>
  );
};

export default AdvancedSetting;
