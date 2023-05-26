import HttpClient from 'utils/HttpClient';

const ATTACHMENT_UPLOAD_API = '/api/app/Attachment/Upload';

interface IFormData {
  objectId: string | null;
  objectType: number | null;
  formFiles: File[];
}

export const APIAttachmentUpload = async (params: IFormData) => {
  const formData = new FormData();
  params.objectId && formData.append('objectId', params.objectId);
  params.objectType &&
    formData.append('objectType', params.objectType.toString());

  if (params.formFiles.length > 0) {
    for (let i = 0; i < params.formFiles.length; i++) {
      formData.append('formFiles', params.formFiles[i]);
    }
  }

  return HttpClient.post<FormData>(ATTACHMENT_UPLOAD_API, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
