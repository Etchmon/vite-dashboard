import { Box, Flex } from "@chakra-ui/react";
import SidebarContent from "./SidebarContent.jsx";

function Navbar() {
  return (
    <Box>
      {/* Main Container */}
      <Flex>
        {/* Sidebar */}
        <Box
          bg="catppuccin.base"
          p={4}
          width={{ base: "100%", lg: "300px" }}
          height={{ base: "100vh", lg: "100vh" }}
          position={{ base: "fixed", lg: "fixed" }}
          top={0}
          left={0}
          overflowY="auto"
          display={{ base: "none", lg: "block" }}
          zIndex={{ base: "overlay", lg: "auto" }}
        >
          <SidebarContent />
        </Box>
      </Flex>
    </Box>
  );
}

export default Navbar;
