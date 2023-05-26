import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Button, Grid, Typography } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import Image from 'components/Image';
import UploadInput from 'components/UploadInput';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ImageObject } from 'views/Warehouse/CreateWarehouse/utils/types';

interface IProps {
  images: ImageObject[];
  setImages: Dispatch<SetStateAction<ImageObject[]>>;
  disabled?: boolean;
}

const SelectFiles = (props: IProps) => {
  const { images, setImages, disabled = false } = props;

  const [showAllImages, setShowAllImages] = useState<boolean>(false);

  const handleShowAllImages = () => {
    setShowAllImages(true);
  };

  const handleImageRemove = (id: string) => {
    const newImages = images.filter((image) => image.id !== id);
    setImages(newImages);
  };

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

  const displayedImages = showAllImages ? images : images.slice(0, 5);

  return (
    <div>
      <Button
        variant="contained"
        size="medium"
        component="label"
        sx={{ height: '100%', mb: 2, cursor: disabled ? 'default' : 'pointer' }}
      >
        Chọn File
        <UploadInput
          accept="image/*"
          multiple
          onChange={onSelectFileImage}
          disabled={disabled}
        />
      </Button>
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
              src={image.src || image.url || ''}
              sx={{
                width: '100%',
                height: '100px',
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
            {!disabled && (
              <CancelOutlinedIcon
                sx={{
                  position: 'absolute',
                  top: '16px',
                  right: 0,
                  cursor: 'pointer',
                }}
                onClick={() => handleImageRemove(image.id)}
              />
            )}
          </Grid>
        ))}
        {images.length > 5 && !showAllImages && (
          <Grid item xs={4} spacing={2}>
            <Grid
              item
              sx={{
                width: '100%',
                height: '100px',
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
              <Typography fontSize="32px">{images.length - 5} +</Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default SelectFiles;
