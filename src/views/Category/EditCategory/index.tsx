import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Image from 'components/Image';
import PageBreadcrumbs from 'components/PageBreadcrumbs';
import PageWrapper from 'components/PageWrapper';
import ActionButton from 'components/ProButton/ActionButton';
import ProForm from 'components/ProForm';
import ProFormSelect from 'components/ProForm/Label/ProFormSelect';
import ProFormContent from 'components/ProForm/ProFormContent';
import ProFormLabel from 'components/ProForm/ProFormLabel';
import ProFormRadio from 'components/ProForm/ProFormRadio';
import ProFormTextField from 'components/ProForm/ProFormTextField';
import UploadInput from 'components/UploadInput';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import { IForm } from './utils/types';

const schema = Validation.shape({
  status: Validation.select(1),
  category: Validation.select(1),
  display: Validation.select(1),
});

const EditCategoryTab = () => {
  const form = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const handleSubmit = (data: any) => {
    console.log(data);
  };
  const [selectedFileImage, setSelectedFileImage] = useState<any>();
  const [previewImage, setPreviewImage] = useState<any>();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFileImage) {
      setPreviewImage(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFileImage);
    setPreviewImage(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFileImage]);

  const onSelectFileImage = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFileImage(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFileImage(e.target.files[0]);
  };

  const [selectedFileIcon, setSelectedFileIcon] = useState<any>();
  const [previewIcon, setPreviewIcon] = useState<any>();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFileIcon) {
      setPreviewIcon(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFileIcon);
    setPreviewIcon(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFileIcon]);

  const onSelectFileIcon = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFileIcon(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFileIcon(e.target.files[0]);
  };

  return (
    <PageWrapper title={'Sửa danh mục'}>
      <PageBreadcrumbs
        title={'Sửa danh mục'}
        items={[{ link: '/category', text: 'Danh mục sản phẩm' }]}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows:
            'fit-content(20%) fit-content(40%) fit-content(40%)',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '20px',
          marginTop: '10px',
        }}
      >
        <Stack direction="column" spacing={2}>
          <ProForm form={form} onFinish={handleSubmit}>
            <ProFormContent>
              <Paper sx={{ p: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {'Thông tin'}
                  </Typography>
                  <Box sx={{ width: '30%' }}>
                    <ProFormSelect
                      name="status"
                      options={[
                        { value: 1, label: 'Hiển thị' },
                        { value: 2, label: 'Ẩn' },
                      ]}
                      placeholder={'Trạng thái'}
                    />
                  </Box>
                </Box>
                <Divider />
                <Grid container spacing={2} marginTop={1} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Danh mục'} name="category" />
                    <ProFormSelect
                      name="category"
                      options={[{ value: 1, label: '123' }]}
                      placeholder={'Nhập danh mục'}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Tên'} name="name" />
                    <ProFormTextField name="name" placeholder={'Nhập tên'} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Mã danh mục'} name="code" />
                    <ProFormTextField name="code" placeholder={'Nhập mã danh mục'} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Tags'} name="tag" />
                    <ProFormTextField name="tag" placeholder={'Nhập tags'} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Mô tả'} name="des" />
                    <ProFormTextField name="des" placeholder={'Nhập mô tả'} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Hiển thị trang chủ'} name="display" />
                    <ProFormSelect
                      name="display"
                      options={[{ value: 1, label: '123' }]}
                      placeholder={'Hiển thị trang chủ'}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Thứ tự'} name="order" />
                    <ProFormTextField name="order" placeholder={'Thứ tự'} />
                  </Grid>
                </Grid>
              </Paper>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2} marginTop={1} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Sau khi lưu dữ liệu'} name="code" />
                    <ProFormRadio
                      name="afterSave"
                      options={[
                        { value: 1, label: 'Tiếp tục thêm danh mục' },
                        { value: 2, label: 'Hiển thị danh mục' },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Box>
            </ProFormContent>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1}>
                <ActionButton actionType="save" type="submit">
                  Lưu
                </ActionButton>
              </Stack>
            </Box>
          </ProForm>
        </Stack>
        <Stack direction="column" spacing={2}>
          <ProForm form={form}>
            <ProFormContent sx={{ minWidth: 'fit-content' }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ p: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {'Ảnh'}
                  </Typography>
                </Box>
                <Divider />
                <Grid container spacing={2} marginTop={1} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Ảnh'} name="name" />
                    <Button variant="contained" component="label">
                      Upload
                      <UploadInput
                        accept="image/*"
                        onChange={onSelectFileImage}
                      />
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    {selectedFileImage && (
                      <Image
                        src={previewImage}
                        sx={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Icon'} name="code" />
                    <Button variant="contained" component="label">
                      Upload
                      <UploadInput
                        accept="image/*"
                        onChange={onSelectFileIcon}
                      />
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    {selectedFileIcon && (
                      <Image
                        src={previewIcon}
                        sx={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </ProFormContent>
          </ProForm>
        </Stack>
      </Box>
    </PageWrapper>
  );
};

export default EditCategoryTab;
