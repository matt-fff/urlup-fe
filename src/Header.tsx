import Logo from "./Logo";
import { Link } from "react-router-dom";
import { HStack } from "@chakra-ui/react";

function Header() {
  return (
    <Link to="/" className="header">
      <HStack>
        <Logo />
        <h1>urlup</h1>
      </HStack>
    </Link>
  );
}

export default Header;
