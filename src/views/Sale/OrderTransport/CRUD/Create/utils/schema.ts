import Regexs from 'utils/Regexs';
import Validation from 'utils/Validation';
import * as yup from 'yup';

export const schema = Validation.shape({
  fromStoreId: Validation.string()
    .nullable()
    .optional()
    .required('Cửa hàng không được để trống')
    .default(null),
  isWarehouseTransfer: yup.boolean().default(false),
  toStoreId: Validation.array()
    .of(
      yup.object().shape({
        storeId: Validation.string()
          .required('Cửa hàng không được để trống')
          .default(null),
      })
    )
    .default([]),
  customerId: Validation.string()
    .optional()
    .nullable()
    // .required('Tên khách hàng không được để trống')
    .default(null),
  transportForm: Validation.number().optional().default(2),
  transportId: Validation.string()
    .optional()
    .default(null)
    .when('transportForm', {
      is: 2,
      then: (schema) =>
        schema.required('Đơn vị vận chuyển không được để trống'),
    }),
  transportName: Validation.string()
    .optional()
    .when('transportForm', {
      is: 2,
      then: (schema) =>
        schema.required('Tên đơn vị vận chuyển không được để trống'),
    }),
  transportPhoneNumber: Validation.string()
    .optional()
    .when('transportForm', {
      is: 2,
      then: (schema) =>
        schema
          .required('SĐT đơn vị vận chuyển không được để trống')
          .matches(Regexs.phoneSpace, 'Số điện thoại không hợp lệ')
      ,
    }),
  carrierWay: Validation.number().optional().default(0),
  note: Validation.string().optional().default(''),
  idOrder: Validation.string().optional().default(''),
  customerNameOrders: Validation.string().optional().default(''),
  form: Validation.array()
    .of(
      yup.object().shape({
        orderId: Validation.string().nullable().default(null),
        customerName: Validation.string().nullable().default(null),
      })
    )
    .default([]),
});
