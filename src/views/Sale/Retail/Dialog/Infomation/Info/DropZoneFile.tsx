import styled from '@emotion/styled';
import Tooltip from '@mui/material/Tooltip';
import ActionButton from 'components/ProButton/ActionButton';
import ActionIconButton from 'components/ProButton/ActionIconButton';
import { DragDropRef } from 'components/ProTable/types/refs';
import useNotification from 'hooks/useNotification';
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { uploadFileCustomerBillDetail } from 'slices/billCustomerApplicationSlice';
import { AppDispatch } from 'store';

interface Props<T> {
  billId: string;
  attachments: any[];
}

const DropzoneFileDinhKem = <T extends object>(
  props: Props<T>,
  refAction: ForwardedRef<DragDropRef>
) => {
  const { billId, attachments } = props;
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const setNotification = useNotification();

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return;
      }
      onUploadFile(acceptedFiles);
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      let newFilesState = [...files.concat(newFiles)];
      setFiles(newFilesState);
    },
  });
  const handleOpenDrop = () => {
    open();
  };
      
  useImperativeHandle(refAction, () => ({
    onOpenDrop: handleOpenDrop,
  }));

  const onUploadFile = async (fileUpload: any) => {
    try {
      setLoading(true);
      const response = await dispatch(
        uploadFileCustomerBillDetail({
          files: fileUpload
            .map((_item: any) => _item)
            .filter((x: any) => x !== null) as File[],
          objectId: billId,
        })
      );
      // @ts-ignore
      // if (isEmpty(response.error)) {
      //   setNotification({
      //     message: 'Tạo mới phiếu chuyển kho thành công',
      //     severity: 'success',
      //   });
      // } else {
      //   setNotification({
      //     error: 'Lỗi khi tạo mới phiếu chuyển kho!',
      //   });
      // }
    } catch (error) {
      // console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  

  const thumbs = attachments?.map((file: any, index: any) => {
    console.log(file);
    
    if (file.typeFile === 'application/pdf') {
      return (
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            borderRadius: 2,
            border: '1px solid #eaeaea',
            marginBottom: 8,
            marginRight: 8,
            width: 150,
            height: 200,
            padding: 4,
            boxSizing: 'border-box',
          }}
          key={file?.fileName}
        >
          <div
            style={{
              display: 'flex',
              minWidth: 0,
              overflow: 'hidden',
              flexDirection: 'column',
            }}
          >
            <img
              src={'/pdf-icon.png'}
              style={{
                display: 'block',
                width: 'auto',
                height: '80%',
              }}
              onLoad={() => {
                decodeURIComponent(file?.fileUrl);
              }}
            />

            <Tooltip title={file.path}>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  width: 130,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {file.path}
              </span>
            </Tooltip>
          </div>
          <ActionIconButton actionType="delete" onClick={() => remove(index)} />
        </div>
      );
    } else if (
      file?.typeFile ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return (
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            borderRadius: 2,
            border: '1px solid #eaeaea',
            marginBottom: 8,
            marginRight: 8,
            width: 150,
            height: 200,
            padding: 4,
            boxSizing: 'border-box',
          }}
          key={file?.fileName}
        >
          <div
            style={{
              display: 'flex',
              minWidth: 0,
              overflow: 'hidden',
              flexDirection: 'column',
            }}
          >
            <img
              src={'/excel-icon.png'}
              style={{
                display: 'block',
                width: 'auto',
                height: '80%',
              }}
              onLoad={() => {
                decodeURIComponent(file?.fileUrl);
              }}
            />
            <Tooltip title={file.fileName}>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  width: 130,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {file.fileName}
              </span>
            </Tooltip>
          </div>
          <ActionIconButton actionType="delete" onClick={() => remove(index)} />
        </div>
      );
    } else if (
      file?.typeFile ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return (
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            borderRadius: 2,
            border: '1px solid #eaeaea',
            marginBottom: 8,
            marginRight: 8,
            width: 150,
            height: 200,
            padding: 4,
            boxSizing: 'border-box',
          }}
          key={file?.fileName}
        >
          <div
            style={{
              display: 'flex',
              minWidth: 0,
              overflow: 'hidden',
              flexDirection: 'column',
            }}
          >
            <img
              src={'/word-icon.png'}
              style={{
                display: 'block',
                width: 'auto',
                height: '80%',
              }}
              onLoad={() => {
                decodeURIComponent(file?.fileUrl);
              }}
            />
            <Tooltip title={file.fileName}>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  width: 130,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {file.fileName}
              </span>
            </Tooltip>
          </div>
          <ActionIconButton actionType="delete" onClick={() => remove(index)} />
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            borderRadius: 2,
            border: '1px solid #eaeaea',
            marginBottom: 8,
            marginRight: 8,
            width: 150,
            height: 200,
            padding: 4,
            boxSizing: 'border-box',
          }}
          key={file?.fileName}
        >
          <div
            style={{
              display: 'flex',
              minWidth: 0,
              overflow: 'hidden',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <img
              src={file?.preview}
              style={{
                display: 'block',
                width: 'auto',
                height: '80%',
              }}
              onLoad={() => {
                decodeURIComponent(file?.fileUrl);
              }}
            />
            <Tooltip title={file.fileName}>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  width: 130,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {file.fileName}
              </span>
            </Tooltip>
          </div>
          <ActionIconButton actionType="delete" onClick={() => remove(index)} />
        </div>
      );
    }
  });

  useEffect(() => {
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file?.preview));
  }, []);

  const remove = (file: any) => {
    const newFiles = [...files]; // make a var for the new array
    newFiles.splice(file, 1); // remove the file from the array
    setFiles(newFiles); // update the state
  };

  return (
    <>
      <section className="container">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
        </div>
        <aside
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 16,
          }}
        >
          {thumbs}
        </aside>
      </section>
      {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {' '}
        <ActionButton
          actionType="save"
          disabled={files.length > 0 ? false : true}
          onClick={() => onUploadFile()}
        >
          Lưu
        </ActionButton>
      </div> */}
    </>
  );
};

export default forwardRef(DropzoneFileDinhKem);
