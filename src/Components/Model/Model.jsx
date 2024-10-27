import classNames from "classnames/bind";
import styles from "./Model.module.scss";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className={cx("modal-overlay")} onClick={onClose}>
      <div
        className={cx("modal-container")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cx("modal-header")}>
          <h2>{title}</h2>
          <button className={cx("modal-close")} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={cx("modal-content")}>{children}</div>
      </div>
    </div>
  );
}
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Modal;
