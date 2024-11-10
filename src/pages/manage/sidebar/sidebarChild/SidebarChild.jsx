import PropTypes from "prop-types";

import classNames from "classnames/bind";
import styles from "./SidebarChild.module.scss";

const cx = classNames.bind(styles);

function SidebarChild({ feature }) {
  return <div className={cx("sidebarChild")}>{feature}</div>;
}

SidebarChild.propTypes = {
  feature: PropTypes.string.isRequired,
};

export default SidebarChild;
