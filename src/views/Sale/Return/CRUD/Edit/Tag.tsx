import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import StyleIcon from '@mui/icons-material/Style';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormTextField from 'components/ProForm/Label/ProFormTextField';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';

const schema = Validation.shape({
  name: Validation.string().optional(),
});

const Tag = () => {
  const [isSHowTag, setShowTag] = useState<boolean>(false);
  const form = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const handleSubmit = (values: any) => {};

  return (
    <Box
      sx={{
        border: '1px solid #E6E8F0',
        marginBottom: '10px',
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        sx={{ padding: '10px 15px' }}
      >
        <Box sx={{ display: 'flex' }}>
          <StyleIcon />
          <span
            style={{
              fontWeight: 'bold',
              display: 'inline-block',
              marginLeft: '10px',
            }}
          >
            Nhãn
          </span>
        </Box>
        <AddIcon onClick={() => setShowTag(!isSHowTag)} />
      </Grid>
      <Box>
        <Divider />
      </Box>

      <Box sx={{ padding: '10px 15px' }}>
        {isSHowTag && (
          <ProForm
            form={form}
            onFinish={handleSubmit}
            PaperProps={{ sx: { p: 2 } }}
          >
            <Box sx={{ marginBottom: '5px', display: 'flex' }}>
              <Checkbox />
              <ProFormTextField
                name="name"
                InputLabelProps={{ shrink: true }}
                placeholder="Tìm kiếm nhãn"
              />
            </Box>
            <Grid container justifyContent="flex-end">
              <ActionButton
                variant="outlined"
                sx={{ padding: 0, marginRight: 1 }}
              >
                Đóng
              </ActionButton>
              <ActionButton
                variant="contained"
                sx={{ padding: 0, marginRight: 1 }}
                color="success"
              >
                Lưu
              </ActionButton>
            </Grid>
          </ProForm>
        )}
      </Box>
    </Box>
  );
};

export default Tag;
