import classNames from "classnames/bind";
import styles from "./ConfirmModel.module.scss";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

function ConfirmModel({ title, content, callbackOk, callbackCancel }) {
  return (
    <div className={cx("modal")}>
      <div className={cx("modal__container")}>
        <div className={cx("modal__container__header")}>
          <h2>{title}</h2>
          <button
            className={cx("modal__container__header__close")}
            onClick={callbackCancel}
          >
            ×
          </button>
        </div>
        <div className={cx("modal__container__content")}>
          <p>{content}</p>
          <div className={cx("modal__container__content__footer")}>
            <button
              className={cx("modal__container__content__footer__button")}
              onClick={callbackOk}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ConfirmModel.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  callbackOk: PropTypes.func.isRequired,
  callbackCancel: PropTypes.func.isRequired,
};

export default ConfirmModel;
