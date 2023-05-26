import { generateBill } from './__mock__';

// Get list bill
export const getBills = async () => {
  return {
    data: Array.from({ length: 35 }, () => generateBill()),
    message: null,
    messageCode: null,
    success: true,
    total: 35,
  };
};
