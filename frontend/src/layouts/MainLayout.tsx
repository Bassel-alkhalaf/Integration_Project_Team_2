import { Box, CssBaseline, Stack, Toolbar } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Nav } from "./Nav";

const drawerWidth = 240;
const footerHeight = 60;

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <Header handleDrawerToggle={handleDrawerToggle} />

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Nav
          drawerWidth={drawerWidth}
          sx={{
            width: { sm: drawerWidth },
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "auto",
          }}
          mobileOpen={mobileOpen}
          handleDrawerClose={handleDrawerClose}
          handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        />

        <Stack
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            overflow: "auto",
            paddingBottom: `${footerHeight}px`,
          }}
        >
          <Toolbar />

          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Outlet />
          </Box>
        </Stack>
      </Box>

      <Box
        component="footer"
        sx={{
          height: `${footerHeight}px`,
          width: "100%",
          position: "fixed",
          bottom: 0,
          left: 0,
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}
