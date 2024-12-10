import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import SidebarChild from "./sidebarChild";
import PropTypes from "prop-types";
import { useState } from "react";

const cx = classNames.bind(styles);

function Sidebar({ selected, setSelected }) {
  const features = ["Category", "Product", "Order", "Promotion", "Report"];
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));

  return (
    <div className={cx("sidebar", "grid__column__2")}>
      <div className={cx("sidebar__employee")}>
        <span className={cx("sidebar__employee__name")}>
          {user?.vaiTro?.tenVaiTro}: <br />
          {user?.ten || user?.sdt}
        </span>
      </div>
      <div className={cx("sidebar__content")}>
        <div className={cx("sidebar__content__title")}>Dashboard</div>
        {features.map((feature, index) => (
          <SidebarChild
            key={index}
            feature={feature}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default Sidebar;
