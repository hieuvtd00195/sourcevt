import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Stack, Tab, Typography } from '@mui/material';
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
import { NumberInput, PriceDecimalInput } from 'plugins/NumberFormat';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Validation from 'utils/Validation';
import AddNewCategory from './AddNewCategory';
import { IImportExport } from './utils/types';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { APIGetProduct } from 'services/saleOrder';
import ProFormAutocompleteSingal from 'components/ProForm/ProFormAutocompleteSingal';
import { ImageObject } from 'views/Warehouse/CreateWarehouse/utils/types';
import { nanoid } from '@reduxjs/toolkit';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { getListProductCategory } from 'slices/productCategory';
import { APIAllProductCategory } from 'services/productCategory';
import useNotification from 'hooks/useNotification';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { createProduct } from './utils/services';
import { createProductAPi } from 'slices/products';
import { useNavigate } from 'react-router-dom';

const schema = Validation.shape({
  productName: Validation.string().optional().default(null),
  otherName: Validation.string().optional().default(null),
  code: Validation.string().optional().default(null),
  parentId: Validation.string().optional().default(null),
  categoryId: Validation.string().optional().default(null),
  salePrice: Validation.string().optional().default(null),
  status: Validation.string().optional().default(null),
  wholeSalePrice: Validation.string().optional().default(null),
  spaPrice: Validation.string().optional().default(null),
  ratePrice: Validation.string().optional().default(null),
  unit: Validation.string().optional().default(null),
  description: Validation.string().optional().default(null),
  question: Validation.string().optional().default(null),
  // warehouse: Validation.select(1),
  // trangThai: Validation.select(1),
  // danhMuc: Validation.select(1),
});

const CreateProducts = () => {
  const form = useForm<IImportExport>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });
  const setNotification = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [productListOption, setProductListOption] = useState<any[]>([]);
  const [productCategory, setProductCategory] = useState<any[]>([]);
  const [value, setValue] = useState('1');
  const [images, setImages] = useState<ImageObject[]>([]);
  const [showAllImages, setShowAllImages] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleSubmit = async (data: any) => {
    const body = {
      ...data,
      formFiles: images,
    };
    try {
      setLoading(true);
      const response: any = await dispatch(createProductAPi(body));
      if (response.payload) {
        setNotification({
          message: 'Tạo mới phiếu đặt hàng thành công',
          severity: 'success',
        });
        navigate('/products');
      } else {
        setNotification({
          error: 'Lỗi khi tạo mới phiếu đặt hàng!',
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const [isOpenDialogInfo, setOpenDialogInfo] = useState<boolean>(false);
  const handleToggleDialog = () => {
    setOpenDialogInfo((prev) => !prev);
  };

  // create a preview as a side effect, whenever selected file is changed
  // useEffect(() => {
  //   if (!selectedFileImage) {
  //     setPreviewImage(undefined);
  //     return;
  //   }

  //   const objectUrl = URL.createObjectURL(selectedFileImage);
  //   setPreviewImage(objectUrl);

  //   // free memory when ever this component is unmounted
  //   return () => URL.revokeObjectURL(objectUrl);
  // }, [selectedFileImage]);

  const onSelectFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;

    const newImages: ImageObject[] = [];
    for (let i = 0; i < files.length; i++) {
      const id = nanoid();
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = (e) => {
        const newImage: ImageObject = {
          id,
          file: files[i],
          src: e.target?.result as string,
        };
        newImages.push(newImage);

        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
    }
  };

  useEffect(() => {
    Promise.all([APIGetProduct(), APIAllProductCategory()])
      .then(([productRes, categoryRes]) => {
        setProductListOption(productRes);
        setProductCategory(categoryRes);
      })
      .catch((error) => console.error(error))
      .finally(() => {});
  }, []);

  const displayedImages = showAllImages ? images : images.slice(0, 5);
  const handleImageRemove = (id: string) => {
    const newImages = images.filter((image) => image.id !== id);
    setImages(newImages);
  };
  const handleShowAllImages = () => {
    setShowAllImages(true);
  };
  return (
    <PageWrapper title={'Thêm sản phẩm'}>
      <PageBreadcrumbs
        title={'Thêm sản phẩm'}
        items={[{ link: '/products', text: 'Sản phẩm' }]}
      />
      <ProForm form={form} onFinish={handleSubmit}>
        <div
          style={{
            marginTop: '10px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateAreas: '"left right" "bot bot"',
            columnGap: '20px',
            rowGap: '10px',
          }}
        >
          <Stack
            direction={'column'}
            sx={{ gridArea: 'left', minHeight: '100%' }}
          >
          
            <ProFormContent sx={{ minHeight: '100%' }}>
              <Paper sx={{ p: 2, minHeight: '100%' }}>
              <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', marginLeft: '4px' , mb: 2}}
                  >
                    {'Thông tin cơ bản'}
                  </Typography>
                <Grid container spacing={2} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Tên'} name="ten" />
                    <ProFormTextField name="productName" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Tên Khác'} name="ten" />
                    <ProFormTextField name="otherName" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Sp cha'} name="ten" />
                    <ProFormAutocompleteSingal
                      name="parentId"
                      placeholder={'Sản phẩm cha'}
                      options={productListOption}
                      renderValue={(item) => item.id}
                      renderLabel={(item) => `${item.code} - ${item.name}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Danh mục'} name="ten" />
                    <ProFormSelect
                      name="categoryId"
                      placeholder={'Danh mục'}
                      options={productCategory}
                      renderLabel={(option) => option?.value ?? ''}
                      renderValue={(option) => option?.id ?? ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Mã sản phẩm'} name="ten" />
                    <ProFormTextField name="code" />
                  </Grid>
                
                  <Box sx={{ width: '100%', padding: 3, typography: 'body1' }}>
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab label="Mô tả" value="1" />
                          <Tab label="Câu hỏi thường gặp" value="2" />
                        </TabList>
                      </Box>
                      <TabPanel sx={{ pl: 0, pr: 0 }} value="1">
                        {' '}
                        <ProFormTextField
                          name="description"
                          multiline
                          rows={10}
                          defaultValue="Default Value"
                        />
                      </TabPanel>
                      <TabPanel sx={{ pl: 0, pr: 0 }} value="2">
                        <ProFormTextField
                          name="question"
                          multiline
                          rows={10}
                          defaultValue="Default Value"
                        />
                      </TabPanel>
                    </TabContext>
                  </Box>
                </Grid>
              </Paper>
            </ProFormContent>
          </Stack>
          <Stack direction={'column'} sx={{ gridArea: 'right' }}>
            <ProFormContent>
              <Paper sx={{ p: 2 }}>
              <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', marginLeft: '4px' , mb: 2}}
                  >
                    {'Thông tin giao dịch'}
                  </Typography>
                <Grid container spacing={2} marginBottom={1}>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <ProFormLabel title={'Đơn vị tính'} name="donViTinh" />
                    <ProFormTextField
                      name="unit"
                      placeholder="VD: cái, hộp, chiếc, lon"
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <ProFormLabel title={'Giá cước'} name="ratePrice" />
                    <ProFormTextField
                      name="ratePrice"
                      InputProps={{
                        inputComponent: PriceDecimalInput,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <ProFormLabel title={'Giá bán'} name="salePrice" />
                    <ProFormTextField
                      name="salePrice"
                      InputProps={{
                        inputComponent: PriceDecimalInput,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <ProFormLabel title={'Giá sỉ'} name="ma" />
                    <ProFormTextField
                      name="wholeSalePrice"
                      InputProps={{
                        inputComponent: PriceDecimalInput,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <ProFormLabel title={'Giá spa'} name="tyLe" />
                    <ProFormTextField
                      name="spaPrice"
                      InputProps={{
                        inputComponent: PriceDecimalInput,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <ProFormLabel title={'Trạng thái bán'} name="ma" />
                    <ProFormSelect
                      name="status"
                      placeholder="Trạng thái bán"
                      options={[
                        { value: '0', label: 'Mới' },
                        { value: '1', label: 'Đang bán' },
                        { value: '3', label: 'Ngừng bán' },
                        { value: '4', label: 'Hết hàng' },
                        { value: '5', label: 'Thanh lý' },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </ProFormContent>
            <ProFormContent>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2} marginBottom={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ProFormLabel title={'Ảnh'} name="name" />
                    <Button variant="contained" component="label">
                      Upload
                      <UploadInput
                        multiple
                        accept="image/*"
                        onChange={onSelectFileImage}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Grid container spacing={2}>
                      {displayedImages.map((image) => (
                        <Grid
                          item
                          xs={4}
                          key={image.id}
                          sx={{
                            position: 'relative',
                            width: 'fit-content',
                          }}
                        >
                          <Image
                            src={image.src}
                            sx={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                          <CancelOutlinedIcon
                            sx={{
                              position: 'absolute',
                              top: '16px',
                              right: 0,
                              cursor: 'pointer',
                            }}
                            color="primary"
                            onClick={() => handleImageRemove(image.id)}
                          />
                        </Grid>
                      ))}
                      {images.length > 5 && !showAllImages && (
                        <Grid item xs={4} spacing={2}>
                          <Grid
                            item
                            sx={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: 1,
                              background: '#F5F5F5',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onClick={handleShowAllImages}
                          >
                            <Typography fontSize="32px">
                              {images.length - 5} +
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    container
                    gap={1}
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                  >
                    <ActionButton actionType="save" type="submit">
                      Lưu
                    </ActionButton>
                    <ActionButton actionType="cancel" type="submit">
                      Huỷ
                    </ActionButton>
                  </Grid>
                </Grid>
              </Paper>
            </ProFormContent>
          </Stack>

          {isOpenDialogInfo ? (
            <AddNewCategory
              open={isOpenDialogInfo}
              onClose={handleToggleDialog}
            />
          ) : null}
        </div>
      </ProForm>
    </PageWrapper>
  );
};

export default CreateProducts;
