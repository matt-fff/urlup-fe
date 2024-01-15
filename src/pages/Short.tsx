import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Input,
  Center,
  Card,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  TableContainer,
  Table,
  Tr,
  Td,
  Tbody,
  Spinner,
  FormControl,
  FormErrorMessage,
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

  const [isLoading, setIsLoading] = useState(!cachedRow);
  const [error, setError] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const shortcode = searchParams.get("s") ?? row.short;

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const fetchData = async (shortcode: string) => {
      const url = await getUrl(shortcode);
      setRow(url);
      setIsLoading(false);
    };

    if (shortcode) {
      fetchData(shortcode);
      setTimeout(() => {
        if (isLoading) {
          setError("Request timed out");
          setIsLoading(false);
        }
      }, 3000);
    }
  }, [isLoading, row, shortcode]);

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
              <FormErrorMessage paddingX=".3rem">{error}</FormErrorMessage>
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
        <TableContainer>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Original URL</Td>
                <Td
                  maxW="20rem" // Set maximum width
                  overflowX="auto" // Enable horizontal scrolling
                  isNumeric
                >
                  {row.url}
                </Td>
              </Tr>
              <Tr>
                <Td>Total Clicks</Td>
                <Td isNumeric>{row.clicks}</Td>
              </Tr>
              <Tr>
                <Td>Date Shortened</Td>
                <Td
                  maxW="20rem" // Set maximum width
                  overflowX="auto" // Enable horizontal scrolling
                  isNumeric
                >
                  {row.created_at}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Center>
  );
}

export default Short;
