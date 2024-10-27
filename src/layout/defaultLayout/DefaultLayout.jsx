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

  return (
    <div className={cx("container")}>
      <Header setSearch={setSearch} />
      <div className={cx("body")}>
        <div className={cx("body__path")}>
          <Path />
        </div>
        <div className={cx("body__content")}>
          <div className={cx("wrapper")}>
            <div className={cx("grid__row")}>
              <SideBar />
              {React.Children.map(children, (child) =>
                cloneElement(child, { search })
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
