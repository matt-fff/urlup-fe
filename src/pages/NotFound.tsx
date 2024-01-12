import { Link } from "react-router-dom";
import { Center, VStack } from "@chakra-ui/react";

function NotFound() {
  return (
    <Center>
      <VStack>
        <h1>404</h1>
        <h2>
          Can't find that. Wanna go <Link to="/">home</Link>?
        </h2>
      </VStack>
    </Center>
  );
}

export default NotFound;
