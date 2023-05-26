import Validation from 'utils/Validation';

export const createCustomerSchema = Validation.shape({
  typeCustomer: Validation.string().optional().nullable().default(null),
  group: Validation.string().optional().nullable().default(null),
  name: Validation.string().optional().nullable().default(null),
  code: Validation.string().required('Mã khách hàng bắt buộc').default(null),
  phoneNumber: Validation.string().optional().nullable().default(null),
  email: Validation.string().optional().nullable().default(null),
  birthDay: Validation.date().optional().nullable().default(null),
  gender: Validation.string().optional().nullable().default(null),
  seller: Validation.string().optional().nullable().default(null),
  province: Validation.string().optional().nullable().default(null),
  district: Validation.string().optional().nullable().default(null),
  ward: Validation.string().optional().nullable().default(null),
  address: Validation.string().optional().nullable().default(null),
  facebook: Validation.string().optional().nullable().default(null),
  presenter: Validation.string().optional().nullable().default(null),
  carer: Validation.string().optional().nullable().default(null),
  debtLimit: Validation.string().optional().nullable().default(null),
  debtClassification: Validation.string().optional().nullable().default(null),
});
