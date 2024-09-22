import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "./Dashboard";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <Router>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </Grid>
    </Box>
  </ChakraProvider>
);
