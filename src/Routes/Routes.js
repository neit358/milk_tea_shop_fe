import config from "../config/config";
import DefaultLayout from "../layout/defaultLayout";
import Home from "../pages/home";
import ProductDetail from "../pages/productDetail/ProductDetail";

const configRoutes = [
  {
    path: config.routes.home,
    component: Home,
    layout: DefaultLayout,
    name: "home",
  },
  {
    path: config.routes.detail,
    component: ProductDetail,
    layout: DefaultLayout,
    name: "detail",
  },
];

export default configRoutes;
