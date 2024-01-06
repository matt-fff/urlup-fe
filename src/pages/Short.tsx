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
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

function Short() {
  let {
    state: { shortUrl = null },
  } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [row, setRow] = useState({
    url: "",
    clicks: 0,
    short: "",
    date: "",
  });
  //const shortened: ShortUrl = {
  //  url: "https://leetcode.com/problems/clone-graph/description/very/very/very/very/very/very/very",
  //  short: "https://urlup.org/akhfdahui",
  //  clicks: 82,
  //  createdAt: new Date(),
  //};

  if (shortUrl == null) {
    setIsLoading(true);
  } else {
    setRow(shortUrl);
  }

  useEffect(() => {
    if (!isLoading) {
      return;
    }
  }, [isLoading, row]);

  return (
    <Center>
      <VStack>
        <Card m={7}>
          <InputGroup size="md">
            <Input
              pr="12rem"
              placeholder="Your shorturl here"
              value={shortUrl.short}
            />
            <InputRightElement width="6rem">
              <Button
                size="md"
                colorScheme="blue"
                leftIcon={<CopyIcon />}
                onClick={async () => await copyToClipboard(shortUrl.short)}
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
                <ScrollableTd isNumeric>{shortUrl.url}</ScrollableTd>
              </Tr>
              <Tr>
                <Td>Total Clicks</Td>
                <Td isNumeric>{shortUrl.clicks}</Td>
              </Tr>
              <Tr>
                <Td>Date Shortened</Td>
                <ScrollableTd isNumeric>{shortUrl.created_at}</ScrollableTd>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Center>
  );
}

export default Short;
