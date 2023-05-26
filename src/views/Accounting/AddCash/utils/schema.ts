import * as yup from 'yup';
import Validation from 'utils/Validation';
import { isEmpty } from 'lodash';

const date = new Date();

export const validationSchema = yup.object().shape({
  transactionDate: Validation.date()
    .optional()
    .required('Ngày thu chi không được để trống')
    // .test(
    //   'transactionDate',
    //   'Ngày thu chi không hợp lệ',
    //   (value: Date | null) => {
    //     if (value) {
    //       return new Date() > new Date(value);
    //     }
    //     return true;
    //   }
    // )
    .when('audienceType', (source, field) => {
      if (source === 3) {
        return field.test(
          'transactionDate',
          'Ngày thu chi không hợp lệ',
          (value: Date) => {
            const year = new Date(value).getFullYear();
            const month = new Date(value).getMonth();
            const day = new Date(value).getDay();
            const yearNow = new Date().getFullYear();
            const monthNow = new Date().getMonth();
            const dayNow = new Date().getDay();
            const fomatToday = `${dayNow}/${monthNow}/${yearNow}`;
            const fomatValue = `${day}/${month}/${year}`;

            if (value) {
              return new Date() < new Date(value) || fomatValue === fomatToday;
            }
          }
        );
      }
    })
    .default(date),
  audienceType: yup
    .number()
    .nullable()
    .default(null)
    .required('Loại đối tượng không được để trống'),

  ticketType: yup
    .number()
    .nullable()
    .default(null)
    .required('Loại phiếu không được để trống'),
  audienceId: Validation.string()
    .optional()
    .nullable()
    .when('audienceType', (source, field) => {
      if (source !== 4) {
        return field.required('Đối tượng không được để trống');
      }
    }),
  accountCode: yup
    .string()
    .nullable()
    .default(null)
    .required('Tài khoản không được để trống'),
  reciprocalAccountCode: Validation.string()
    .optional()
    .nullable()
    .when('audienceType', (source, field) => {
      if (source === 4) {
        return field.required('Tài khoản đối ứng không được để trống');
      }
    })
    .default(null),
  amountCNY: Validation.string()
    .optional()
    .nullable()
    .when('audienceType', (source, field) => {
      if (source === 2) {
        return field.required('Số tiền tệ không được để trống');
      }
    })
    .default(null),
  amountVND: Validation.string()
    .optional()
    .nullable()
    .required('Số tiền VND không được để trống'),
  note: Validation.string().optional(),
});
