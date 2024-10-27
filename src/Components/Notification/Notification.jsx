import classNames from "classnames/bind";
import style from "./Notification.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const cx = classNames.bind(style);

function ToastInformation({ content, title, bool, setBool, timeOut = 3000 }) {
  const [typeIcon, setTypeIcon] = useState(faCircleCheck);

  useEffect(() => {
    switch (title) {
      case "Success": {
        setTypeIcon(faCircleCheck);
        break;
      }
      case "Error": {
        setTypeIcon(faCircleExclamation);
        break;
      }
      case "Warn": {
        setTypeIcon(faTriangleExclamation);
        break;
      }
      default:
        setTypeIcon(faCircleExclamation);
    }
  }, []);

  const handleOnClickExit = () => {
    setBool(false);
  };

  const handleOnClickInfor = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setBool(false);
    }, timeOut);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [bool]);

  return (
    <div className={cx("container")} onClick={handleOnClickInfor}>
      <div className={cx("toast", `toast__${title}`)}>
        <div className={cx(`toast__${title}__icon`)}>
          <FontAwesomeIcon icon={typeIcon} />
        </div>
        <div className={cx("toast__content")}>{content}</div>
        <div className={cx("toast__notification")} onClick={handleOnClickExit}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
}

ToastInformation.propTypes = {
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  bool: PropTypes.bool.isRequired,
  setBool: PropTypes.func.isRequired,
  timeOut: PropTypes.number,
};

export default ToastInformation;
