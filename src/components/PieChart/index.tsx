import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import PieChart, {
  Connector,
  Label,
  Legend,
  Series,
  SmallValuesGrouping,
} from 'devextreme-react/pie-chart';
import React from 'react';
import './style.css';

const data = [
  {
    title: 'Linh kiện Sài Gòn',
    value: 112,
  },
  {
    title: 'Linh kiện Hà Nội',
    value: 50,
  },
];

const formatText = (arg: any) => {
  return `${arg.argumentText} (${arg.percentText})`;
};

interface IProps {
  title: string;
}

const Chart = (props: IProps) => {
  const { title } = props;

  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <Box>
        <PieChart id="pie" dataSource={data} palette="Bright">
          <Series argumentField="title" valueField="value">
            <Label visible={true} customizeText={formatText}>
              <Connector visible={true} width={0.5} />
            </Label>
          </Series>
          <SmallValuesGrouping threshold={4.5} mode="smallValueThreshold" />
          <Legend visible={false} />
        </PieChart>
      </Box>
    </>
  );
};

export default Chart;
