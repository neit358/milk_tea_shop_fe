import classNames from "classnames/bind";
import styles from "./Manage.module.scss";
import Sidebar from "./sidebar";
import Content from "./content";

const cx = classNames.bind(styles);

function Manage() {
  return (
    <div className={cx("manage")}>
      <div className={cx("wrapper")}>
        <div className={cx("grid__row")}>
          <Sidebar />
          <Content />
        </div>
      </div>
    </div>
  );
}

export default Manage;
