import "../styles/globals.css";
import "../styles/favourites.css";
import "../styles/scholarships.css";

import { FavoritesProvider } from "../context/favouritesContext.jsx";

export default function App({ Component, pageProps }) {
  return (
    <FavoritesProvider>
      <Component {...pageProps} />
    </FavoritesProvider>
  );
}
