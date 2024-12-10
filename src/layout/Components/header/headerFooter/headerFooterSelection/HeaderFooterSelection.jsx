import classNames from "classnames/bind";
import styles from "./HeaderFooterSelection.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as categoryService from "~/services/category.service";
import HeaderFooterSelectionMenu from "./headerFooterSelectionMenu/HeaderFooterSelectionMenu";

const cx = classNames.bind(styles);

function HeaderFooterSelection({ type, setCategory, category }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    switch (type.id) {
      case 1:
        break;
      case 2:
        handleGetCategories();
        break;
      default:
        break;
    }
  }, []);

  const handleGetCategories = async () => {
    const response = await categoryService.getCategories();
    if (response.data.success) {
      setCategories(response.data.result);
    }
  };

  return (
    <li className={cx("headerFooterSelection")}>
      <div className={cx("headerFooterSelection__header")}>
        <span className={cx("headerFooterSelection__header--content")}>
          {type.name}
        </span>
        {type.id !== 1 && (
          <FontAwesomeIcon
            icon={faSortDown}
            className={cx("headerFooterSelection__header--icon")}
          />
        )}
      </div>
      {type.id !== 1 && (
        <ul className={cx("headerFooterSelection__list")}>
          {categories.map((item, index) => (
            <HeaderFooterSelectionMenu
              key={index}
              item={item}
              setCategory={setCategory}
              category={category}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
HeaderFooterSelection.propTypes = {
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  setCategory: PropTypes.func,
  category: PropTypes.object,
};

export default HeaderFooterSelection;
