import Regexs from 'utils/Regexs';
import Validation from 'utils/Validation';
import * as yup from 'yup';

export const schema = yup.object().shape({
  fromStoreId: yup.string().nullable().default(''),
  customerId: yup.string().nullable().default(''),
  isWarehouseTransfer: yup.boolean().nullable().default(false),
  toStoreId: yup
    .array()
    .when('isWarehouseTransfer', {
      is: true,
      then: (schema) =>
        schema.of(
          yup.object({
            storeId: yup
              .string()
              .nullable()
              .required('Cửa hàng không được để trống')
              .default(''),
          })
        ),
      otherwise: (schema) =>
        schema.of(
          yup.object({
            storeId: yup.string().nullable().default(''),
          })
        ),
    })
    .default([]),
  transportForm: yup.number().nullable().default(2),
  transportId: yup
    .string()
    .when('transportForm', {
      is: 2,
      then: (schema) =>
        schema.required('Đơn vị vận chuyển không được để trống'),
    })
    .nullable()
    .default(''),
  transportName: yup
    .string()
    .when('transportForm', {
      is: 2,
      then: (schema) =>
        schema.required('Tên đơn vị vận chuyển không được để trống'),
    })
    .nullable()
    .default(''),
  transportPhoneNumber: yup
    .string()
    .when('transportForm', {
      is: 2,
      then: (schema) =>
        schema
          .required('Số điện thoại không được để trống')
          .matches(Regexs.phoneSpace, 'Số điện thoại không hợp lệ'),
    })
    .nullable()
    .default(''),
  carrierWay: yup.number().nullable().default(0),
  note: yup.string().nullable().default(''),
  idOrder: yup.string().nullable().default(''),
  customerNameOrders: yup.string().nullable().default(''),
  attachment: yup
    .array()
    .of(
      yup.object({
        id: yup.string().nullable().default(''),
        orderId: yup.string().nullable().default(''),
        customerName: yup.string().nullable().default(''),
        customerId: yup.string().nullable().default(''),
      })
    )
    .default([]),
});
