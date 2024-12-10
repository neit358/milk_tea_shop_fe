import classNames from "classnames/bind";
import styles from "./Manage.module.scss";
import Sidebar from "./sidebar";
import Content from "./content";
import { useState } from "react";

const cx = classNames.bind(styles);

function Manage() {
  const [selected, setSelected] = useState("Category");

  return (
    <div className={cx("manage")}>
      <div className={cx("wrapper")}>
        <div className={cx("grid__row", "manage--grid__row")}>
          <Sidebar selected={selected} setSelected={setSelected} />
          <Content selected={selected} />
        </div>
      </div>
    </div>
  );
}

export default Manage;
