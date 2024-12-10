import LayoutOnlyHeaderAndFooter from "~/layout/layoutOnlyHeaderAndFooter";
import config from "../config/config";
import DefaultLayout from "../layout/defaultLayout";
import { LoginPage, RegisterPage } from "../pages/auth";
import Home from "../pages/home";
import ProductDetail from "../pages/productDetail/ProductDetail";
import Cart from "~/pages/cart";
import Manage from "~/pages/manage";
import Order from "~/pages/order";
import Account from "~/pages/Account";

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
  {
    path: config.routes.login,
    component: LoginPage,
    layout: null,
    name: "login",
  },
  {
    path: config.routes.register,
    component: RegisterPage,
    layout: null,
    name: "register",
  },
  {
    path: config.routes.cart,
    component: Cart,
    layout: LayoutOnlyHeaderAndFooter,
    name: "cart",
  },
  {
    path: config.routes.manage,
    component: Manage,
    layout: null,
    name: "manage",
  },
  {
    path: config.routes.order,
    component: Order,
    layout: LayoutOnlyHeaderAndFooter,
    name: "order",
  },
  {
    path: config.routes.account,
    component: Account,
    layout: LayoutOnlyHeaderAndFooter,
    name: "account",
  },
];

export default configRoutes;
