import Box from '@mui/material/Box';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

interface Props<T extends FieldValues> extends HTMLAttributes<HTMLFormElement> {
  form?: UseFormReturn<T, any>;
  onFinish?: (values: T) => Promise<void> | void;
  onError?: (errors: unknown) => Promise<void> | void;
}

const DialogForm = <T extends FieldValues>(
  props: PropsWithChildren<Props<T>>
) => {
  const { children, form, onFinish, onError, ...rest } = props;

  if (!form) {
    return <Box component="form" noValidate {...props} />;
  }

  return (
    <FormProvider {...form}>
      <Box
        noValidate
        component="form"
        onSubmit={onFinish ? form.handleSubmit(onFinish, onError) : void 0}
        {...rest}
      >
        {children}
      </Box>
    </FormProvider>
  );
};

export default DialogForm;
