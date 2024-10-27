import classNames from "classnames/bind";
import styles from "./Path.module.scss";

const cx = classNames.bind(styles);
function Path() {
  return (
    <div className={cx("wrapper", "path")}>
      <div className={cx("path__home")}>Home</div>
    </div>
  );
}

export default Path;
