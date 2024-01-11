import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Center,
  Card,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
} from "@chakra-ui/react";

import { LinkIcon } from "@chakra-ui/icons";
import { createUrl } from "../Api";

function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const shorten = async () => {
    setIsLoading(true);
    try {
      const response = await createUrl(url);
      const queryParams = new URLSearchParams({
        s: response.short,
      }).toString();
      navigate(`/app/short?${queryParams}`, { state: { shortUrl: response } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center>
      <VStack>
        <h2>
          urlup.org is a free service that generates short urls to make links
          easier to share.
        </h2>
        <Card m={7}>
          <InputGroup size="md">
            <Input
              pr="12rem"
              placeholder="Enter your link here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            <InputRightElement width="7rem">
              <Button
                isLoading={isLoading}
                size="md"
                colorScheme="blue"
                aria-label="Shorten URL"
                leftIcon={<LinkIcon />}
                onClick={shorten}
              >
                Shorten
              </Button>
            </InputRightElement>
          </InputGroup>
        </Card>
      </VStack>
    </Center>
  );
}

export default Home;
