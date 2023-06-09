import type { ChangeEvent, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { PatternFormat } from 'react-number-format';

// Override for compatibility with NumberFormat
interface Props extends HTMLAttributes<HTMLInputElement> {
  name?: string & any;
  defaultValue?: string & any;
}

export const PhoneInput = forwardRef<HTMLAttributes<HTMLInputElement>, Props>(
  (props, ref) => {
    const { onChange, name, ...other } = props;

    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        onValueChange={({ value }) => {
          onChange?.({
            target: {
              name: name,
              value: value,
            },
          } as ChangeEvent<HTMLInputElement>);
        }}
        format="#### ### ###"
        allowEmptyFormatting
        valueIsNumericString
      />
    );
  }
);
