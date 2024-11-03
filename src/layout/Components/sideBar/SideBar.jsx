import classNames from "classnames/bind";
import styles from "./SideBar.module.scss";
import config from "~/config/config";
import { NavLink } from "react-router-dom";
import SideBarType from "./sideBarType";
import { useEffect, useState } from "react";
import * as typeService from "../../../services/type.service";

const cx = classNames.bind(styles);

function SideBar({ setCategory }) {
  const [listType, setListType] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await typeService.getTypes();
      if (response.data.success) {
        setListType(response.data.result);
      }
    };
    fetchData();
  }, []);

  const handleClickCategory = (id) => {
    setCategory(id ? { loaiSanPham: id } : {});
  };

  const handleClickItemCategory = () => {
    handleClickCategory("");
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
                  onClick={handleClickItemCategory}
                >
                  <div
                    className={cx(
                      "sidebar__wrapper__child__body__list__select__parent"
                    )}
                    data-id=""
                  >
                    Tất cả loại đồ uống
                  </div>
                </NavLink>
              </li>

              {listType.map((type, index) => (
                <SideBarType
                  key={index}
                  type={type}
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

export default SideBar;
