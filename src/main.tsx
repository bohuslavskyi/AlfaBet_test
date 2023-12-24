import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ConfigProvider } from "antd";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#a60000",
        colorInfo: "#a60000",
        borderRadius: 0,
      },
      components: {
        Collapse: {
          contentBg: "#F1F1F1",
          headerBg: "#A60000",
          colorTextHeading: "#fff",
          contentPadding: "10.5px 11.5px",
        },
      },
    }}
  >
    <App />
  </ConfigProvider>,
);
