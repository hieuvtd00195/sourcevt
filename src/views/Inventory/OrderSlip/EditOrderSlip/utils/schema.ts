import * as yup from 'yup';

const validationSchema = yup.object().shape({
  code: yup.string().nullable().default(null),
  supplierName: yup.string().nullable().default(null),
  storeName: yup.string().nullable().default(null),
  rate: yup.number().nullable().default(0),
  //=====
  id: yup.string().nullable().default(null),
  productId: yup.array().of(yup.string()).default([]),
  package: yup
    .number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .nullable()
    .default(0),
  invoiceNumber: yup
    .string()
    .required('Số hóa đơn không được bỏ trống')
    .trim()
    .nullable()
    .default(null),
  orderDate: yup
    .date()
    .required('Ngày đặt hàng không được bỏ trống')
    .typeError('Ngày đặt hàng không hợp lệ')
    .nullable()
    .default(null),
  note: yup.string().trim().nullable().default(null),
  saleOrderLines: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().nullable().default(null),
        productId: yup.string().nullable().default(''),
        requestQuantity: yup
          .string()
          .trim()
          // .required('SL yêu cầu không được bỏ trống')
          .nullable()
          .default(''),
        requestPrice: yup
          .string()
          .trim()
          // .required('Giá yêu cầu không được bỏ trống')
          .nullable()
          .default(''),
        suggestedPrice: yup
          .string()
          .trim()
          // .required('Giá đề xuất không được bỏ trống')
          .nullable()
          .default(''),
        totalPriceNDT: yup
          .number()
          .transform((value) =>
            isNaN(value) || value === null || value === undefined ? 0 : value
          )
          .nullable()
          .default(0),
        totalPrice: yup
          .number()
          .transform((value) =>
            isNaN(value) || value === null || value === undefined ? 0 : value
          )
          .nullable()
          .default(0),
        isDelete: yup.boolean().nullable().default(false),
      })
    )
    .default([]),
});

export default validationSchema;
