import { useNavigate, startTransition } from "react-router-dom";
import {
  Center,
  Card,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";

import Input from "../components/Input";
import { LinkIcon } from "@chakra-ui/icons";
import { createUrl } from "../Api";

const CreateSchema = Yup.object().shape({
  url: Yup.string()
    .min(3, "Too short")
    .url("Must be a valid URL - like http://example.com") // TODO too restrictive
    .required("Required"),
});

type Values = {
  url: string;
};

function Home() {
  const navigate = useNavigate();

  return (
    <Center>
      <VStack>
        <h2>
          urlup.org is a free service that generates short urls to make links
          easier to share.
        </h2>
        <Card m={7}>
          <Formik
            initialValues={{ url: "" }}
            validationSchema={CreateSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              try {
                const timeoutId = setTimeout(() => {
                  actions.setErrors({ url: "Request timed out" });
                  actions.setSubmitting(false);
                }, 3000);

                const response = await createUrl(values.url);

                clearTimeout(timeoutId);

                const queryParams = new URLSearchParams({
                  s: response.short,
                }).toString();
                navigate(`/app/short?${queryParams}`, {
                  state: { cachedRow: response },
                });
              } catch (error) {
                if (error instanceof Error)
                  actions.setErrors({ url: error.message });
                else actions.setErrors({ url: "Unknown error" });
              } finally {
                actions.setSubmitting(false);
              }
            }}
          >
            {(props: FormikProps<Values>) => (
              <Form onSubmit={props.handleSubmit}>
                <InputGroup size="md" width="30rem">
                  <FormControl
                    isInvalid={!!(props.errors.url && props.touched.url)}
                  >
                    <Input
                      pr="6rem"
                      name="url"
                      placeholder="Your URL here..."
                      disabled={props.isSubmitting}
                    />
                    <FormErrorMessage paddingX=".3rem">
                      {props.errors.url}
                    </FormErrorMessage>
                  </FormControl>
                  <InputRightElement width="6rem">
                    <Button
                      type="submit"
                      size="md"
                      colorScheme="blue"
                      isLoading={props.isSubmitting}
                      leftIcon={<LinkIcon />}
                    >
                      Shorten
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Form>
            )}
          </Formik>
        </Card>
      </VStack>
    </Center>
  );
}

export default Home;
