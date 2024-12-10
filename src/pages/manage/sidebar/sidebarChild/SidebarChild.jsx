import PropTypes from "prop-types";

import classNames from "classnames/bind";
import styles from "./SidebarChild.module.scss";

const cx = classNames.bind(styles);

function SidebarChild({ feature, selected, setSelected }) {
  return (
    <div
      className={cx("sidebarChild")}
      onClick={() => setSelected(feature)}
      style={{
        backgroundColor:
          feature === selected ? "var(--primary-color)" : "transparent",
      }}
    >
      {feature}
    </div>
  );
}

SidebarChild.propTypes = {
  feature: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default SidebarChild;
