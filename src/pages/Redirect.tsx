import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  Center,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

import { redirect } from "../Api";

function Redirect() {
  const { shortcode } = useParams();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  console.log({ shortcode });

  useEffect(() => {
    // Check if the id matches the desired pattern (one or more digits)
    if (!shortcode) {
      setUrl("/app/404");
      setIsLoading(false);
      return;
    }

    const fetchData = async (shortcode: string) => {
      let url = await redirect(shortcode);

      if (!url) {
        url = "/app/404";
      }

      setUrl(url);
      setIsLoading(false);
    };

    setTimeout(() => {
      if (isLoading) {
        setError("Request timed out");
        setIsLoading(false);
      }
    }, 3000);
    fetchData(shortcode);
  }, [shortcode, setUrl, setIsLoading, isLoading]);

  if (isLoading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Request Timeout</AlertTitle>
        <AlertDescription>Refresh the page to retry.</AlertDescription>
      </Alert>
    );
  }

  // I don't think this'll work. We need the server's
  // response to control the interaction.
  return <Navigate to={url} />;
}

export default Redirect;
