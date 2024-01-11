import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";

import { CopyIcon } from "@chakra-ui/icons";
import { getUrl } from "../Api";

interface ShortUrl {
  url: string;
  short: string;
  clicks: number;
  created_at: string;
}

const ScrollableTd = (props) => (
  <Td
    maxW="20rem" // Set maximum width
    overflowX="auto" // Enable horizontal scrolling
    {...props}
  />
);

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

function Short() {
  const location = useLocation();
  const cachedRow = location?.state?.cachedRow;
  const [row, setRow] = useState(
    cachedRow ?? {
      url: "",
      clicks: 0,
      short: "",
      date: "",
    }
  );

  const [isLoading, setIsLoading] = useState(!cachedRow);

  const searchParams = new URLSearchParams(location.search);
  const shortcode = searchParams.get("s") ?? row.short;

  const host = window.location.host;
  const shortUrl = `${host}/${row.short}`;

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const fetchData = async (shortcode: string) => {
      const url = await getUrl(shortcode);
      setRow(url);
    };

    if (shortcode) {
      fetchData(shortcode);
    }
    setIsLoading(false);
  }, [isLoading, row, shortcode]);

  return (
    <Center>
      <VStack>
        <Card m={7}>
          <InputGroup size="md">
            <Input
              pr="12rem"
              placeholder="Your short url here"
              value={shortUrl}
            />
            <InputRightElement width="6rem">
              <Button
                size="md"
                colorScheme="blue"
                leftIcon={<CopyIcon />}
                onClick={async () => await copyToClipboard(shortUrl)}
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
                <ScrollableTd isNumeric>{row.url}</ScrollableTd>
              </Tr>
              <Tr>
                <Td>Total Clicks</Td>
                <Td isNumeric>{row.clicks}</Td>
              </Tr>
              <Tr>
                <Td>Date Shortened</Td>
                <ScrollableTd isNumeric>{row.created_at}</ScrollableTd>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Center>
  );
}

export default Short;
