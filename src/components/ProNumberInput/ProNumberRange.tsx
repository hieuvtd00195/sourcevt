import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { NumberInput } from 'plugins/NumberFormat';
import { Fragment, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

interface Props {
  from: string;
  to: string;
  label: string;
}

const ProNumberRange = (props: Props) => {
  const { from, to, label } = props;
  const ref = useRef<HTMLDivElement>(null);

  const { control, setValue } = useFormContext();

  const fromNumber = useWatch({ control, name: from });
  const toNumber = useWatch({ control, name: to });

  return (
    <Fragment>
      <Wrapper ref={ref}>
        <Label variant="body1" noWrap>
          {label}
        </Label>
        <InputBase
          name={from}
          value={fromNumber || ''}
          onChange={(e) =>
            setValue(from, e.target.value ? Number(e.target.value) : null)
          }
          placeholder="Từ"
          sx={{
            zIndex: 1,

            '& .MuiInputBase-input': {
              py: '8.5px',
              pl: 1.75,
              width: '10.5ch',
              borderRight: '1px solid #E6E8F0',
            },
          }}
          inputComponent={NumberInput}
          inputProps={{ allowNegative: false }}
        />

        <InputBase
          name={to}
          value={toNumber || ''}
          onChange={(e) =>
            setValue(to, e.target.value ? Number(e.target.value) : null)
          }
          placeholder="Đến"
          sx={{
            zIndex: 1,

            '& .MuiInputBase-input': {
              py: '8.5px',
              pl: 1.75,
              width: '10.5ch',
            },
          }}
          inputComponent={NumberInput}
          inputProps={{ allowNegative: false }}
        />
        <Fieldset>
          <Legend>{/* <Span>{label}</Span> */}</Legend>
        </Fieldset>
        {control &&
        Number.isInteger(fromNumber) &&
        Number.isInteger(toNumber) &&
        fromNumber > toNumber ? (
          <ErrorMessage>Khoảng số không hợp lệ</ErrorMessage>
        ) : (
          <></>
        )}
      </Wrapper>
    </Fragment>
  );
};

const ErrorMessage = styled('span')`
  position: absolute;
  bottom: -25px;
  font-size: 14px;
  color: red;
`;

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 4,
  position: 'relative',
  cursor: 'pointer', // Remove later
  ...{
    '&:hover': {
      '& fieldset': {
        borderColor: theme.palette.text.primary,
      },
    },
  },
}));

const Fieldset = styled('fieldset')(({ theme }) => ({
  position: 'absolute',
  top: -5,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 0,
  padding: theme.spacing(0, 1),
  pointerEvents: 'none',
  overflow: 'hidden',
  minWidth: '0%',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
  borderRadius: 'inherit',
}));

const Legend = styled('legend')(({ theme }) => ({
  float: 'unset',
  width: 'auto',
  overflow: 'hidden',
  display: 'block',
  padding: 0,
  height: 11,
  fontSize: '0.75em',
  visibility: 'hidden',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
}));

const Span = styled('span')(({ theme }) => ({
  paddingLeft: 5,
  paddingRight: 5,
  display: 'inline-block',
  opacity: 0,
  visibility: 'visible',
}));

const Label = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  transform: 'translate(14px, -9px) scale(0.75)',
  transformOrigin: 'top left',
  zIndex: 1,
  pointerEvents: 'auto',
  userSelect: 'none',
  maxWidth: 'calc(133% - 24px)',
  color: theme.palette.text.secondary,
}));

export default ProNumberRange;
