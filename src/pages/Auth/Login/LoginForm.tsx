import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Checkbox, FormControlLabel, Link, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormCheckbox from 'components/ProForm/ProFormCheckbox';
import ProFormCheckbox2 from 'components/ProForm/ProFormCheckbox2';
import ProFormGroup from 'components/ProForm/ProFormGroup';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormTextFieldValid from 'components/ProForm/ProFormTextFieldValid';
import { AUTHEN_CLIENT_ID, AUTHEN_GRANT_TYPE, AUTHEN_SCOPE } from 'config';
import useAuthState from 'hooks/useAuthState';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { MouseEvent } from 'types/react';
import Logger from 'utils/Logger';
import Validation from 'utils/Validation';
import useNotification from 'hooks/useNotification';

interface FormValues {
  username: string;
  password: string;
  __tenant: string;
}
export const optionTenant = [
  {
    label: 'S_TENANT_1',
    value: 1,
  },
  {
    label: 'S_TENANT_2',
    value: 2,
  },
  {
    label: 'S_TENANT_3',
    value: 3,
  },
];
const LoginForm = () => {
  const { login } = useAuthState();
  const setNotification = useNotification();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<FormValues>({
    mode: 'onChange',
  });

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword: MouseEvent = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values: FormValues) => {
    const params = {
      __tenant: values.__tenant,
      username: values.username,
      password: values.password,
      client_id: AUTHEN_CLIENT_ID,
      grant_type: AUTHEN_GRANT_TYPE,
      scope: AUTHEN_SCOPE,
    };
    try {
      await login(params);
    } catch (error) {
      Logger.log(error);
      setNotification({
        error: 'Thông tin đăng nhập không chính xác !',
      });
    }
  };

  return (
    <ProForm form={form} onFinish={handleSubmit}>
      <ProFormGroup>
        <ProFormLabel title="Tổ chức" name="__tenant">
          <ProFormTextFieldValid
            name="__tenant"
            type="text"
            validate={Validation.string().nullable().notRequired()}
          />
        </ProFormLabel>
        <ProFormLabel required title="Tên đăng nhập" name="userName">
          <ProFormTextFieldValid
            name="username"
            validate={Validation.string().nullable().required('Bắt buộc')}
            type="email"
          />
        </ProFormLabel>
        <ProFormLabel required title="Mật khẩu" name="password">
          <ProFormTextFieldValid
            name="password"
            validate={Validation.string().nullable().required('Bắt buộc')}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </ProFormLabel>
      </ProFormGroup>
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ProFormCheckbox2
          name={'rememberLogin'}
          label={
            <Typography variant="subtitle2" sx={{ ml: 0.5 }}>
              Ghi nhớ đăng nhập
            </Typography>
          }
          sx={{ m: 0 }}
        />
        <Link href="#" variant="subtitle2">
          Quên mật khẩu?
        </Link>
      </Box>
      <Box sx={{ mt: 3 }}>
        <ActionButton
          size="large"
          type="submit"
          fullWidth
          actionType="login"
          loading={form.formState.isSubmitting}
        >
          Đăng nhập
        </ActionButton>
      </Box>
    </ProForm>
  );
};

export default LoginForm;
