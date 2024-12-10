import classNames from "classnames/bind";
import styles from "./HeaderFooter.module.scss";
import HeaderFooterSelection from "./headerFooterSelection/HeaderFooterSelection";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

function HeaderFooter({ setCategory, category }) {
  const types = [
    {
      id: 1,
      name: "Trang chủ",
      url: "/",
    },
    {
      id: 2,
      name: "Loại đồ uống",
      url: "/menu",
    },
  ];

  const handleOnClickMenu = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={cx("header__footer")}>
      <div className={cx("wrapper")}>
        <div
          className={cx("header__footer__child")}
          onClick={handleOnClickMenu}
        >
          <ul className={cx("header__footer__child__selection")}>
            {types.map((type, index) => (
              <HeaderFooterSelection
                key={index}
                type={type}
                setCategory={setCategory}
                category={category}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

HeaderFooter.propTypes = {
  setCategory: PropTypes.func,
  category: PropTypes.object,
};

export default HeaderFooter;
