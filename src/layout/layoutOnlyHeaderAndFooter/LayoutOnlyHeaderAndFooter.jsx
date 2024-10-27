import PropTypes from "prop-types";
import Header from "../Components/header/Header";
import Footer from "../Components/footer/Footer";
import classNames from "classnames/bind";
import styles from "./LayoutOnlyHeaderAndFooter.module.scss";
import Path from "../Components/Path";

const cx = classNames.bind(styles);

function LayoutOnlyHeaderAndFooter({ children }) {
  return (
    <div className={cx("container")}>
      <Header />
      <div className={cx("body")}>
        <div className={cx("wrapper")}>
          <Path />
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

LayoutOnlyHeaderAndFooter.propTypes = {
  children: PropTypes.node,
};

export default LayoutOnlyHeaderAndFooter;
