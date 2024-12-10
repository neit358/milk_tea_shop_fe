import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import classNames from "classnames/bind";
import styles from "./OrderProgress.module.scss";

const cx = classNames.bind(styles);

function OrderProgress({ invoice, index, listOfStatus }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= invoice.trangThai.tienTrinh) {
          clearInterval(interval);
          return invoice.trangThai.tienTrinh;
        }
        return prev + 25 >= invoice.trangThai.tienTrinh
          ? invoice.trangThai.tienTrinh
          : prev + 25;
      });
    }, 1000);
  }, []);

  return (
    <div className={cx("progress")}>
      <h2 className={cx("progress__title")}>Tiến trình đơn hàng #{index}</h2>
      <div className={cx("progress__bar")}>
        {invoice.trangThai.tienTrinh && (
          <>
            <div className={cx("progress__bar__track")}>
              <div
                className={cx("progress__bar__track__fill")}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className={cx("progress__bar__steps")}>
              {listOfStatus.map((status, index) => (
                <div
                  key={index}
                  className={cx(
                    "progress__bar__steps__step",
                    progress >= status.tienTrinh &&
                      "progress__bar__steps__step--active"
                  )}
                >
                  <span className={cx("progress__bar__steps__step__number")}>
                    {index + 1}
                  </span>
                  <span className={cx("progress__bar__steps__step__label")}>
                    {status.tenTrangThai}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

OrderProgress.propTypes = {
  invoice: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  listOfStatus: PropTypes.array.isRequired,
};

export default OrderProgress;
