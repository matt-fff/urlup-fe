import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Input,
  Center,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  Spinner,
  FormControl,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  Heading,
  Text,
} from "@chakra-ui/react";

import { CopyIcon } from "@chakra-ui/icons";
import { getUrl } from "../Api";

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy: ", err);
    throw err;
  }
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

function Short() {
  const host = import.meta.env.VITE_REDIRECT_HOST;
  const location = useLocation();
  const cachedRow = location?.state?.cachedRow;
  const [row, setRow] = useState(
    cachedRow ?? {
      url: "",
      clicks: 0,
      short: "",
      date: "",
    },
  );

  const preloaded = !!cachedRow;

  const [isLoading, setIsLoading] = useState(!preloaded);
  const [error, setError] = useState("");
  const [errorDescr, setErrorDescr] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const shortcode = searchParams.get("s") ?? "";

  useEffect(() => {
    if (preloaded) {
      setIsLoading(false);
      return;
    }

    if (!shortcode) {
      setError("Cannot find the link.");
      setErrorDescr("No shortcode provided");
      setIsLoading(false);
    }

    const fetchData = async () => {
      const timeoutId = setTimeout(() => {
        setError("Request timed out");
        setErrorDescr("Refresh the page to retry.");
        setIsLoading(false);
      }, 3000);

      const url = await getUrl(shortcode);
      setRow(url);
      clearTimeout(timeoutId);
      setIsLoading(false);
    };

    fetchData();
  }, [preloaded, shortcode]);

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>{error}</AlertTitle>
        <AlertDescription>{errorDescr}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center>
      <VStack>
        <Card m={7}>
          <InputGroup size="md">
            <FormControl>
              <Input
                pr="12rem"
                placeholder="Your short url here"
                value={`${host}/${row.short}`}
                readOnly
              />
            </FormControl>
            <InputRightElement width="6rem">
              <Button
                size="md"
                colorScheme="blue"
                leftIcon={<CopyIcon />}
                onClick={async () =>
                  await copyToClipboard(`${host}/${row.short}`)
                }
              >
                Copy
              </Button>
            </InputRightElement>
          </InputGroup>
        </Card>
        <Card maxW="sm">
          <CardBody>
            <Stack spacing="3">
              <Heading size="md" color="blue.300">
                Original URL
              </Heading>
              <Text>
                <a href={row.url}>{row.url}</a>
              </Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <Stat>
              <StatLabel fontWeight="bold">Total Clicks</StatLabel>
              <StatNumber>{row.clicks}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontWeight="bold">Date Created</StatLabel>
              <StatLabel>{formatDate(row.created_at)}</StatLabel>
            </Stat>
          </CardFooter>
        </Card>
      </VStack>
    </Center>
  );
}

export default Short;
