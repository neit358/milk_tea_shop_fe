import {
  faCartShopping,
  faHeart,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./HomeChild.module.scss";
import { convertCurrency } from "~/shared/services/convert.service";
import Image from "~/Components/Image";
import ProductDetail from "~/pages/productDetail";

const cx = classNames.bind(styles);

function HomeChild({ sanPham }) {
  const [addCart, setAddCart] = useState(false);
  const [promotion, setPromotion] = useState(null);

  const formattedPrice = convertCurrency(sanPham.gia);

  const handleModelAddCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddCart(true);
  };

  useEffect(() => {
    if (sanPham.khuyenMai.length) {
      sanPham.khuyenMai?.forEach((item) => {
        if (
          new Date(item.ngayBatDau) <= new Date() &&
          new Date(item.ngayKetThuc) >= new Date() &&
          item?.trangThai &&
          !item?.isDel
        ) {
          setPromotion(item);
        }
      });
    }
  }, []);

  return (
    <>
      <NavLink to={`/chi_tiet_san_pham/${sanPham._id}`}>
        <li className={cx("homeChild", "grid__column__10--3")}>
          <div className={cx("homeChild__child")}>
            <div className={cx("homeChild__child__type")}>
              {sanPham.loaiSanPham.tenLoaiSanPham}
            </div>
            <div className={cx("homeChild__child__name")}>
              {sanPham.tenSanPham}
            </div>
            <div className={cx("homeChild__child__image")}>
              <Image
                alt="Ảnh"
                src={sanPham.hinhAnh}
                className={cx("homeChild__child__image__detail")}
              />
            </div>
            <div className={cx("homeChild__child__description")}>
              {sanPham.moTa}
            </div>
            <div className={cx("homeChild__child__price")}>
              <div className={cx("homeChild__child__price__cost")}>
                <div className={cx("homeChild__child__price__cost--default")}>
                  {formattedPrice}
                </div>
              </div>
              <div className={cx("homeChild__child__price__icon")}>
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className={cx("homeChild__child__price__icon--child")}
                  onClick={handleModelAddCart}
                />
              </div>
            </div>
            <div className={cx("homeChild__child__interact")}>
              <div className={cx("homeChild__child__interact__wishlist")}>
                <FontAwesomeIcon
                  icon={faHeart}
                  className={cx("homeChild__child__interact__wishlist--icon")}
                />
                <span
                  className={cx(
                    "homeChild__child__interact__wishlist--content"
                  )}
                >
                  wishlist
                </span>
              </div>
              <div className={cx("homeChild__child__interact__compare")}>
                <FontAwesomeIcon
                  icon={faRepeat}
                  className={cx("homeChild__child__interact__compare--icon")}
                />
                <span
                  className={cx("homeChild__child__interact__compare--content")}
                >
                  compare
                </span>
              </div>
            </div>
            {promotion && (
              <div className={cx("homeChild__child__tag")}>{promotion.tag}</div>
            )}
          </div>
        </li>
      </NavLink>
      {addCart && (
        <div className={cx("modelCart")} onClick={() => setAddCart(false)}>
          <div
            className={cx("modelCart__content")}
            onClick={(e) => e.stopPropagation()}
          >
            <ProductDetail idProduct={sanPham._id} />
          </div>
        </div>
      )}
    </>
  );
}
HomeChild.propTypes = {
  sanPham: PropTypes.shape({
    _id: PropTypes.string,
    tenSanPham: PropTypes.string,
    gia: PropTypes.number,
    moTa: PropTypes.string,
    kichThuoc: PropTypes.array,
    hinhAnh: PropTypes.string,
    loaiSanPham: PropTypes.shape({
      tenLoaiSanPham: PropTypes.string,
    }),
    khuyenMai: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        tenKhuyenMai: PropTypes.string,
        moTa: PropTypes.string,
        phuongThucKhuyenMai: PropTypes.string,
        giaTriKhuyenMai: PropTypes.number,
        giaTriDonHangToiThieu: PropTypes.number,
        giaToiDaKhuyenMai: PropTypes.number,
        ngayBatDau: PropTypes.string,
        ngayKetThuc: PropTypes.string,
        trangThai: PropTypes.bool,
        tag: PropTypes.string,
        isDel: PropTypes.bool,
      })
    ),
  }).isRequired,
};

export default HomeChild;
