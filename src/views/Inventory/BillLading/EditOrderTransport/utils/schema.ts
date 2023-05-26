import Regexs from 'utils/Regexs';
import * as yup from 'yup';
import Validation from 'utils/Validation';

const validationSchema = yup.object().shape({
  transporterId: yup
    .string()
    .nullable()
    .when('totalPrice', (value, schema) => {
      if (parseFloat(value) > 0) {
        return schema.required('Tên nhà vận chuyển không được bỏ trống');
      } else {
        return schema.notRequired();
      }
    })
    .default(null),
  status: yup.number().nullable().default(null),
  totalPrice: yup
    .string()
    .nullable()
    .matches(Regexs.number2, 'Số tiền không hợp lệ')
    .default(null),
  transportCode: yup
    .string()
    .nullable()
    .when('totalPrice', (value, schema) => {
      if (parseFloat(value) > 0) {
        return schema.required('Mã vận đơn không được bỏ trống');
      } else {
        return schema.notRequired();
      }
    })
    .default(null),
  dateTransport: yup
    .date()
    .nullable()
    .typeError('Ngày vận chuyển không hợp lệ')
    .default(null),
  dateArrive: yup
    .date()
    .nullable()
    .typeError('Ngày về không hợp lệ')
    .default(null),
  // dateArrive: Validation.date().notRequired().default(null),
});

export default validationSchema;
