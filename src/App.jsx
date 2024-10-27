import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import configRoutes from "./Routes/Routes";
import { Fragment } from "react";

function App() {
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
