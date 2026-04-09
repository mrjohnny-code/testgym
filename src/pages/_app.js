import "@/styles/globals.css";
import { montserrat, raleway } from "../components/fonts";

export default function App({ Component, pageProps }) {
  return (
    <div className={`${montserrat.variable} ${raleway.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
