import PropTypes from "prop-types";

import classNames from "classnames/bind";
import styles from "./Content.module.scss";
import ProductManager from "./productManager";
import OrderManage from "./orderManager";
import CategoryManager from "./categoryManager";
import PromotionManager from "./promotionManager/PromotionManager";
import ReportComponent from "./reportManager/ReportManager";

const cx = classNames.bind(styles);

function Content({ selected }) {
  return (
    <div className={cx("content", "grid__column__10")}>
      {selected === "Category" ? (
        <CategoryManager />
      ) : selected === "Product" ? (
        <ProductManager />
      ) : selected === "Order" ? (
        <OrderManage />
      ) : selected === "Promotion" ? (
        <PromotionManager />
      ) : selected === "Report" ? (
        <ReportComponent />
      ) : null}
    </div>
  );
}

Content.propTypes = {
  selected: PropTypes.string.isRequired,
};

export default Content;
