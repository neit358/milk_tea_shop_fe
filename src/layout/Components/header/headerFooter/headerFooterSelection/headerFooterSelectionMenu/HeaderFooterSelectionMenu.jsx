import classNames from "classnames/bind";
import style from "./HeaderFooterSelectionMenu.module.scss";
import PropTypes from "prop-types";

const cx = classNames.bind(style);

function HeaderFooterSelectionMenu({ detail }) {
  return (
    <li className={cx("HeaderFooterSelectionMenu")}>
      <div className={cx("HeaderFooterSelectionMenu__name")}>
        {detail.tenSanPham}
      </div>
      <ul className={cx("HeaderFooterSelectionMenu__list")}></ul>
    </li>
  );
}

HeaderFooterSelectionMenu.propTypes = {
  detail: PropTypes.shape({
    tenSanPham: PropTypes.string.isRequired,
  }).isRequired,
};

export default HeaderFooterSelectionMenu;
