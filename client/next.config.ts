import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "7102f627-a440-4c41-9381-b2c0192ae708",
  exclude: ["/preview/*", "/_next/*", "/favicon.ico", "/sitemap.xml", "/robots.txt", "/*.jpg", "/*.png", "/*.svg", "/*.gif"],
  loginSuccessUrl: "/", // Redirect a home dopo login
  logoutUrl: "/preview", // Redirect a preview dopo logout
  loginUrl: "/preview" // Pagina dove mandare gli utenti non autenticati
});

export default withCivicAuth(nextConfig);
