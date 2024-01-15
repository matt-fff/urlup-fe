import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  Center,
  Card,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { LinkIcon } from "@chakra-ui/icons";
import { createUrl } from "../Api";

const CreateSchema = Yup.object().shape({
  url: Yup.string()
    .min(3, "Too short")
    .url("Must be a valid URL") // TODO too restrictive
    .required("Required"),
});

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
            {({ isSubmitting }) => (
              <Form>
                <InputGroup size="md">
                  <Field name="url">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.url && form.touched.url}
                      >
                        <Input
                          pr="12rem"
                          placeholder="Your URL here..."
                          disabled={isSubmitting}
                          {...field}
                        />
                        <FormErrorMessage paddingX=".3rem">
                          {form.errors.url}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <InputRightElement width="6rem">
                    <Button
                      type="submit"
                      size="md"
                      colorScheme="blue"
                      isLoading={isSubmitting}
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
