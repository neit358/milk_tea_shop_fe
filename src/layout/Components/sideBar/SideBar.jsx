import classNames from "classnames/bind";
import styles from "./SideBar.module.scss";
import config from "~/config/config";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import * as CategoryService from "../../../services/category.service";
import SideBarChild from "./sideBarChild";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

function SideBar({ setCategory, category }) {
  const [listCategory, setListCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await CategoryService.getCategories();
      if (response.data.success) {
        setListCategory(response.data.result);
      }
    };
    fetchData();
  }, []);

  const handleClickCategory = (id) => {
    setCategory(id ? { loaiSanPham: id } : {});
  };

  return (
    <div className={cx("sidebar", "grid__column__2")}>
      <div className={cx("sidebar__wrapper")}>
        <div className={cx("sidebar__wrapper__child")}>
          <div className={cx("sidebar__wrapper__child__header")}>
            Browse Categories
          </div>
          <div className={cx("sidebar__wrapper__child__body")}>
            <ul className={cx("sidebar__wrapper__child__body__list")}>
              <li className={cx("sidebar__wrapper__child__body__list__select")}>
                <NavLink
                  to={config.routes.home}
                  className={cx("link-href")}
                  onClick={() => handleClickCategory("")}
                  style={{
                    fontWeight: !category?.loaiSanPham ? "bolder" : "normal",
                  }}
                >
                  <div
                    className={cx(
                      "sidebar__wrapper__child__body__list__select__parent"
                    )}
                  >
                    Tất cả loại đồ uống
                  </div>
                </NavLink>
              </li>

              {listCategory.map((item, index) => (
                <SideBarChild
                  key={index}
                  item={item}
                  category={category}
                  handleClickCategory={handleClickCategory}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

SideBar.propTypes = {
  setCategory: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
};

export default SideBar;
