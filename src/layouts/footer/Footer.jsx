import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";

const Footer = () => {
  const [t] = useTranslation();

  return (
    <footer className="main-footer">
      <strong>
        <span>
          {t("Copyright")} © {DateTime.now().toFormat("y")}{" "}
        </span>
        <a
          href="https://www.itdoseinfo.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("ITDOSE INFOSYSTEMS PVT. LTD.")}
        </a>
        {/* <span>.</span> */}
      </strong>
      <div className="float-right d-none d-sm-inline-block">
        <strong>
          {" "}
          <a
            href={window.location.origin}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("ElabPro.In")}
          </a>{" "}
        </strong>
        &nbsp;<b>{t("Version")} </b> <span>&nbsp; 1.0.0</span>
      </div>
    </footer>
  );
};

export default Footer;
