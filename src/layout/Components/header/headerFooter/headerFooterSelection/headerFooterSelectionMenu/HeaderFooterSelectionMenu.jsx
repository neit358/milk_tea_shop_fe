import classNames from "classnames/bind";
import style from "./HeaderFooterSelectionMenu.module.scss";
import PropTypes from "prop-types";

const cx = classNames.bind(style);

function HeaderFooterSelectionMenu({ item, setCategory, category }) {
  return (
    <li
      className={cx("HeaderFooterSelectionMenu")}
      onClick={() => setCategory(item._id)}
    >
      <div
        className={cx("HeaderFooterSelectionMenu__name")}
        style={{
          fontWeight: category?.loaiSanPham === item._id ? "bolder" : "normal",
        }}
      >
        {item.tenLoaiSanPham}
      </div>
      <ul className={cx("HeaderFooterSelectionMenu__list")}></ul>
    </li>
  );
}

HeaderFooterSelectionMenu.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tenLoaiSanPham: PropTypes.string.isRequired,
  }).isRequired,
  setCategory: PropTypes.func,
  category: PropTypes.object,
};

export default HeaderFooterSelectionMenu;
