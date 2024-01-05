import React, { useState } from "react";
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

async function shortenRequest(url: string) {
    try {
        const response = await fetch("https://example.com/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Handle response here, e.g., display the shortened URL
    } catch (error) {
        console.error("Error shortening URL:", error);
    }
}

function App() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const shorten = async () => {
        setIsLoading(true);
        try {
            shortenRequest(url);
        } finally {
            setIsLoading(false);
        }
    };

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
                        <Input
                            pr="12rem"
                            placeholder="Enter your link here"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isLoading}
                        />
                        <InputRightElement>
                            <IconButton
                                isLoading={isLoading}
                                size="md"
                                colorScheme="blue"
                                aria-label="Shorten URL"
                                icon={<LinkIcon />}
                                onClick={shorten}
                            />
                        </InputRightElement>
                    </InputGroup>
                </Card>
            </VStack>
        </Center>
    );
}

export default App;
