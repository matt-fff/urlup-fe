import { FieldHookConfig, useField } from "formik";
import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from "@chakra-ui/react";

type Props = ChakraInputProps & FieldHookConfig<"input">;

const Input = ({ name, ...props }: Props) => {
  const [field] = useField(name);
  // @ts-expect-error I don't care that it's "too complicated"
  return <ChakraInput {...props} {...field} />;
};

export default Input;
