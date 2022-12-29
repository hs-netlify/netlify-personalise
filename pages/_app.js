import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div id="main-body">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
