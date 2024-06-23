import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
        <Head>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>Amplify</title>
            <meta name="description" content="Amplify" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="mask-icon" href="https://docs.amplify.aws/assets/logo-dark.svg" color="#FFFFFF" />
            <meta name="theme-color" content="#ffffff" />
            <link rel="apple-touch-icon" href="https://docs.amplify.aws/assets/logo-dark.svg" />
            <link
                rel="apple-touch-icon"
                sizes="152x152"
                href="https://docs.amplify.aws/assets/logo-dark.svg"
            />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="https://docs.amplify.aws/assets/logo-dark.svg"
            />
            <link
                rel="apple-touch-icon"
                sizes="167x167"
                href="https://docs.amplify.aws/assets/logo-dark.svg"
            />
            <link rel="manifest" href="/manifest.json" />
        </Head>
      <body>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
