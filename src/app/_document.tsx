import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en" className="sr">
        <Head />
        <body className="overflow-x-hidden"> {/* Added overflow-x-hidden to prevent horizontal scrolling */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

