import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Input, Center, Card, InputGroup, VStack } from "@chakra-ui/react";

import { redirect } from "../Api";

function Redirect() {
  const { shortcode } = useParams();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the id matches the desired pattern (one or more digits)
    if (!shortcode || !/^\d+$/.test(shortcode)) {
      setUrl("/404");
      setIsLoading(false);
      return;
    }

    const fetchData = async (shortcode: string | undefined) => {
      if (!shortcode) {
        setUrl("/404");
        setIsLoading(false);
        return;
      }

      const url = await redirect(shortcode);

      if (!url) {
        setUrl("/404");
        setIsLoading(false);
        return;
      }
      setUrl(url);
      setIsLoading(false);
    };

    fetchData(shortcode);
  }, [shortcode, setUrl, setIsLoading]);

  if (!isLoading) {
    return <Navigate to={url} />;
  }

  return (
    <Center>
      <VStack>
        <Card m={7}>
          <InputGroup size="md">
            <Input
              pr="12rem"
              placeholder="Your shorturl here"
              value={shortcode}
            />
          </InputGroup>
        </Card>
      </VStack>
    </Center>
  );
}

export default Redirect;
