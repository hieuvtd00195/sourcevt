import Index from 'components/ProTable/components/Index';
import { ProColumn } from 'components/ProTable/types';
import { useMemo } from 'react';

interface Props {
  pageNumber: number;
  pageSize: number;
}

const useTableColumns = (props: Props) => {
  const { pageNumber, pageSize } = props;

  const columns: ProColumn<any> = useMemo(() => {
    return [Index<any>(pageNumber, pageSize)];
  }, [pageNumber, pageSize]);
  return { columns };
};

export default useTableColumns;
