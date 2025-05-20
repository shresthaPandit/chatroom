"use client";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from "react";

function MuiThemeRegistry({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  // Create MUI theme based on next-themes' resolvedTheme
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme === "dark" ? "dark" : "light",
        },
      }),
    [resolvedTheme]
  );

  // Prevent hydration mismatch by only rendering after theme is resolved
  if (!resolvedTheme) return null;

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MuiThemeRegistry>{children}</MuiThemeRegistry>
    </NextThemeProvider>
  );
} 