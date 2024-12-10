import classNames from "classnames/bind";
import styles from "./OrderChild.module.scss";
import Image from "~/Components/Image/Image";

const cx = classNames.bind(styles);

import PropTypes from "prop-types";
import { convertCurrency } from "~/shared/services/convert.service";

function OrderChild({ item }) {
  return (
    <>
      <tr className={cx("orderChild")}>
        <td className={cx("orderChild__column")}>
          <Image
            alt="ảnh sản phẩm"
            src={item.sanPham.hinhAnh}
            className={cx("orderChild__column__image")}
          />
        </td>
        <td className={cx("orderChild__column")}>
          <div className={cx("orderChild__column__content")}>
            {item.sanPham.tenSanPham}
          </div>
        </td>
        <td className={cx("orderChild__column")}>
          <div className={cx("orderChild__column__content")}>
            {item.soLuong + (item.soLuongKhuyenMai || 0)}
          </div>
        </td>
        <td className={cx("orderChild__column")}>
          <div className={cx("orderChild__column__content")}>
            {item.thongTinKichThuoc.kichThuoc.tenKichThuoc}
          </div>
        </td>
        <td className={cx("orderChild__column")}>
          <div className={cx("orderChild__column__content")}>
            {item.thongTinTopping?.length > 0
              ? item.thongTinTopping.map((topping) => (
                  <div key={topping._id}>
                    {topping.topping.tenTopping} x {topping.soLuong}
                  </div>
                ))
              : "--"}
          </div>
        </td>
        <td className={cx("orderChild__column")}>
          <div className={cx("orderChild__column__content")}>
            {convertCurrency(item.thanhTien)}
          </div>
        </td>
        <td className={cx("orderChild__column")}>
          <div className={cx("orderChild__column__content")}>
            {item.da?.tenDa &&
              item.da?.tenDa !== "Bình thường" &&
              `Đá: ${item.da?.tenDa}`}
          </div>
          <div className={cx("orderChild__column__content")}>
            {item.ngot?.tenNgot &&
              item.ngot?.tenNgot !== "Bình thường" &&
              `Đường: ${item.ngot?.tenNgot}`}
          </div>
          <div className={cx("orderChild__column__content")}>
            {item.tra?.tenTra &&
              item.tra?.tenTra !== "Bình thường" &&
              `Trà: ${item.tra?.tenTra}`}
          </div>
        </td>
      </tr>
    </>
  );
}

OrderChild.propTypes = {
  item: PropTypes.object.isRequired,
};

export default OrderChild;
