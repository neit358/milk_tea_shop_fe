import classNames from "classnames/bind";
import styles from "./HeaderFooterSelection.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as typeService from "../../../../../services/type.service";
import HeaderFooterSelectionMenu from "./headerFooterSelectionMenu/HeaderFooterSelectionMenu";

const cx = classNames.bind(styles);

function HeaderFooterSelection({ type }) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    switch (type.id) {
      case 1:
        break;
      case 2:
        handleGetMenu();
        break;
      default:
        break;
    }
  }, []);

  const handleGetMenu = async () => {
    const response = await typeService.getTypes();
    if (response.data.success) {
      setMenu(response.data.result);
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
          {menu.map((detail, index) => (
            <HeaderFooterSelectionMenu key={index} detail={detail} />
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
};

export default HeaderFooterSelection;
