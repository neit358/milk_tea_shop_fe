import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import SidebarChild from "./sidebarChild";

const cx = classNames.bind(styles);

function Sidebar() {
  const features = ["Product", "Order", "User", "Report"];

  return (
    <div className={cx("sidebar", "grid__column__2")}>
      <div className={cx("sidebar__title")}>Dashboard</div>
      {features.map((feature, index) => (
        <SidebarChild key={index} feature={feature} />
      ))}
    </div>
  );
}

export default Sidebar;
