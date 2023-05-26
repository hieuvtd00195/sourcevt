import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormGroup from 'components/ProForm/ProFormGroup';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormSelect from 'components/ProForm/ProFormSelect';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import ProFormTextFieldValid from 'components/ProForm/ProFormTextFieldValid';
import useAuthState from 'hooks/useAuthState';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { MouseEvent } from 'types/react';
import Logger from 'utils/Logger';
import Validation from 'utils/Validation';

interface FormValues {
  userName: string;
  password: string;
  tenantCode: string;
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
const RecoveryForm = () => {
  const { login } = useAuthState();
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
    try {
    //   await login(values);
    } catch (error) {
      Logger.log(error);
    }
  };

  return (
    <ProForm form={form} onFinish={handleSubmit}>
      <ProFormGroup>
        <ProFormLabel required title="Email address" name="userName">
          <ProFormTextFieldValid
            name="userName"
            validate={Validation.email()}
            type="email"
          />
        </ProFormLabel>
      </ProFormGroup>
      <Box sx={{ mt: 3 }}>
        <ActionButton
          size="large"
          type="submit"
          fullWidth
          actionType="login"
          loading={form.formState.isSubmitting}
        >
          Send Email
        </ActionButton>
      </Box>

    </ProForm>
  );
};

export default RecoveryForm;
