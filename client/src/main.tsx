import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import App from "./App";
import "./index.css";
import "./i18n";
import { useTranslation } from "react-i18next";

function Root() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  return <App />;
}

createRoot(document.getElementById("root")!).render(<Root />);
