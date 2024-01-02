import logo from "./assets/logo.png";
import {
    Input,
    Center,
    Card,
    InputGroup,
    InputRightElement,
    IconButton,
    VStack,
} from "@chakra-ui/react";

import { LinkIcon } from "@chakra-ui/icons";

import "./App.css";

function App() {
    return (
        <Center>
            <VStack>
                <img src={logo} className="logo" alt="urlup logo" />
                <h1>urlup</h1>
                <h2>
                    urlup.org is a free service that generates short urls to
                    make links easier to share.
                </h2>
                <Card m={7}>
                    <InputGroup size="md">
                        <Input pr="12rem" placeholder="Enter your link here" />
                        <InputRightElement>
                            <IconButton
                                size="md"
                                colorScheme="blue"
                                aria-label="Shorten URL"
                                icon={<LinkIcon />}
                            />
                        </InputRightElement>
                    </InputGroup>
                </Card>
            </VStack>
        </Center>
    );
}

export default App;
