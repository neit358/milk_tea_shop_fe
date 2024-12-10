import PropTypes from "prop-types";
import Header from "../Components/header/Header";
import Footer from "../Components/footer/Footer";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import SideBar from "../Components/SideBar";
import Path from "../Components/Path";
import React, { cloneElement, useState } from "react";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const [search, setSearch] = useState({});
  const [category, setCategory] = useState({});

  return (
    <div className={cx("container")}>
      <Header
        setSearch={setSearch}
        setCategory={setCategory}
        category={category}
      />
      <div className={cx("body")}>
        <div className={cx("body__path")}>
          <Path />
        </div>
        <div className={cx("body__content")}>
          <div className={cx("wrapper")}>
            <div className={cx("grid__row")}>
              <SideBar setCategory={setCategory} category={category} />
              {React.Children.map(children, (child) =>
                cloneElement(child, { search, category })
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node,
};

export default DefaultLayout;
