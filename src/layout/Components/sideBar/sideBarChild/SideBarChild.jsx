import classNames from "classnames/bind";
import styles from "./SideBarChild.module.scss";
import { NavLink } from "react-router-dom";
import config from "~/config/config";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);
function SideBarChild({ item, handleClickCategory, category }) {
  return (
    <li
      className={cx("sidebarChild")}
      onClick={() => handleClickCategory(item?._id)}
      style={{
        fontWeight: category?.loaiSanPham === item?._id ? "bolder" : "normal",
      }}
    >
      <div className={cx("sidebarChild__parent")}>
        <NavLink to={config.routes.home}>
          <div className={cx("sidebarChild__parent__content")}>
            {item.tenLoaiSanPham}
          </div>

          <span className={cx("sidebarChild__parent__quality")}></span>
        </NavLink>
      </div>
    </li>
  );
}

SideBarChild.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tenLoaiSanPham: PropTypes.string.isRequired,
  }).isRequired,
  handleClickCategory: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
};

export default SideBarChild;
