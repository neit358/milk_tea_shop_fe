import classNames from "classnames/bind";
import styles from "./Content.module.scss";
import ProductManager from "./productManager";

const cx = classNames.bind(styles);

function Content() {
  return (
    <div className={cx("content", "grid__column__10")}>
      <ProductManager />
    </div>
  );
}

export default Content;
