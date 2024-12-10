import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import configRoutes from "./Routes/Routes";
import { Fragment, useEffect } from "react";
import * as authService from "./services/auth.service";

function App() {
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const fetchData = async () => {
        const response = await authService.checkAuth();
        if (!response.data.success) {
          localStorage.removeItem("user");
          window.location.reload();
        }
        localStorage.setItem("user", JSON.stringify(response.data.result));
      };
      fetchData();
    }
  }, []);

  return (
    <Router>
      <Routes>
        {configRoutes.map((configRoute, index) => {
          let Layout = configRoute.layout;
          if (Layout === null) {
            Layout = Fragment;
          }
          const Page = configRoute.component;
          return (
            <Route
              key={index}
              path={configRoute.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
