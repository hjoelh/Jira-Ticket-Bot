import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Header, HEADER_HEIGHT } from "../src/components/shared/Header";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGlobalStore } from "../src/useGlobalStore";
import Home from ".";
import { trpc } from "../src/trpc";
import Script from "next/script";
import { Github } from "../src/components/shared/Github";

const title = "Jira Ticket Bot - for GitHub";
const description =
  "Free tool that comments Jira Ticket Links on Pull Requests";

function MyApp({ Component, pageProps }: AppProps) {
  const user = useGlobalStore((s) => s.user);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jira-ticket-bot.app" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/og-img.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://jira-ticket-bot.app" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="/og-img.png" />

        <script type="text/javascript">{`window.$crisp=[];window.CRISP_WEBSITE_ID="c1cf70bf-6fd6-45f7-b0f2-5263dd2fc50a";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}</script>
      </Head>
      <Script defer src="https://cdn.splitbee.io/sb.js"></Script>

      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <div style={{ padding: "25px", height: "100vh" }}>
            <Header />
            <div
              style={{
                height: `calc(100% - ${HEADER_HEIGHT})`,
                padding: "20px 0",
              }}
            >
              {user ? <Component {...pageProps} /> : <Home />}
            </div>
          </div>
        </ChakraProvider>
      </QueryClientProvider>
      <Github />
    </>
  );
}

const queryClient = new QueryClient();

export default trpc.withTRPC(MyApp);
