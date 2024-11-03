import classNames from "classnames/bind";
import style from "./ProductDetail.module.scss";
import {
  faCaretDown,
  faCaretUp,
  faCartArrowDown,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";
import numeral from "numeral";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import ToastInformation from "~/Components/Notification";
import { useParams } from "react-router-dom";
import Image from "../../Components/Image/Image";
import * as productService from "~/services/product.service";
import * as cartService from "~/services/cart.service";

const cx = classNames.bind(style);
function ProductDetail({ idProduct }) {
  const [bool, setBool] = useState(false);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState({});
  const [sweetness, setSweetness] = useState("");
  const [ice, setIce] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const idRef = useRef(id || idProduct);
  const [user] = useState(JSON.parse(localStorage.getItem("user") || null));

  useEffect(() => {
    const id = idRef.current;
    const fetchData = async () => {
      const response = await productService.getProduct(id);
      if (response.data.success) {
        setProduct(response.data.result);
        setSize(response.data.result.thongTinKichThuoc[0]);
        setSweetness(response.data.result.ngot[1]);
        setIce(response.data.result.da[1]);
      }
    };
    fetchData();
  }, [id, idProduct]);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddCart = async () => {
    if (!user) {
      setBool(true);
      setContent("Vui lòng đăng nhập để thêm vào giỏ hàng");
      setTitle("Error");
      setTimeout(() => {
        setBool(false);
      }, 3000);
      return;
    }

    const response = await cartService.addCart({
      idSanPham: product._id,
      soLuong: quantity,
      thongTinKichThuoc: size,
      ngot: sweetness,
      da: ice,
    });

    setBool(true);
    setContent(response.data.message);
    if (response.data.success) {
      setTitle("Success");
      setTimeout(() => {
        setBool(false);
        window.location.reload();
      }, 3000);
    } else setTitle("Error");
  };

  return (
    <div
      className={cx("productDetails", {
        "grid__column-10": id,
        "grid__column-12": !id,
      })}
    >
      <div className={cx("productDetails__child", "grid__row")}>
        <div className={cx("productDetails__child__left", "grid__column-10-4")}>
          <div className={cx("productDetails__child__left__img")}>
            {product.hinhAnh ? (
              <Image
                alt="ảnh chi tiết sản phẩm"
                src={product.hinhAnh}
                className={cx("productDetails__child__left__img__child")}
              />
            ) : (
              <p>Hình ảnh không khả dụng</p>
            )}
            <div className={cx("productDetails__child__left__img__icon")}>
              <FontAwesomeIcon
                icon={faMagnifyingGlassPlus}
                className={cx("productDetails__child__left__img__icon__child")}
              />
            </div>
          </div>
        </div>
        <div
          className={cx("productDetails__child__right", "grid__column-10-6")}
        >
          <div className={cx("productDetails__child__right__base")}>
            <div className={cx("productDetails__child__right__base__name")}>
              {product.tenSanPham || ""}
            </div>
            <div className={cx("productDetails__child__right__base__address")}>
              <p>
                <strong>Chi nhánh áp dụng:</strong>{" "}
                {product.chiNhanhApDung?.map(
                  (branch, index) =>
                    `${branch.tenChiNhanh}${
                      index < product.chiNhanhApDung.length - 1 ? ", " : "."
                    }`
                )}
              </p>
            </div>
          </div>
          <div className={cx("productDetails__child__right__advanced")}>
            <div
              className={cx("productDetails__child__right__advanced__price")}
            >
              <div
                className={cx(
                  "productDetails__child__right__advanced__price--default"
                )}
              >
                {product.gia && (
                  <span>{numeral(product.gia).format("0,0")} đ</span>
                )}
              </div>
            </div>
            <div
              className={cx(
                "productDetails__child__right__advanced__description"
              )}
            >
              {product.moTa || "Không có mô tả"}
            </div>

            <div
              className={cx("productDetails__child__right__advanced__options")}
            >
              <h3>Chọn kích cỡ</h3>
              <div
                className={cx(
                  "productDetails__child__right__advanced__options__selection"
                )}
              >
                {product.thongTinKichThuoc?.map((option, index) => (
                  <button
                    key={index}
                    className={cx(
                      "productDetails__child__right__advanced__options__size",
                      size.kichThuoc._id === option.kichThuoc._id
                        ? "productDetails__child__right__advanced__options__active"
                        : ""
                    )}
                    onClick={() => setSize(option)}
                  >
                    <label>{option.kichThuoc.tenKichThuoc}</label>
                    <label>
                      {option.giaThem ? `+${option.giaThem} đ` : "0 đ"}
                    </label>
                  </button>
                ))}
              </div>
            </div>

            <div
              className={cx("productDetails__child__right__advanced__options")}
            >
              <h3>Ngọt</h3>

              <div
                className={cx(
                  "productDetails__child__right__advanced__options__selection"
                )}
              >
                {product.ngot?.map((option, index) => (
                  <button
                    key={index}
                    className={cx(
                      sweetness === option
                        ? "productDetails__child__right__advanced__options__active"
                        : ""
                    )}
                    onClick={() => setSweetness(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={cx("productDetails__child__right__advanced__options")}
            >
              <h3>Đá</h3>
              <div
                className={cx(
                  "productDetails__child__right__advanced__options__selection"
                )}
              >
                {product.da?.map((option, index) => (
                  <button
                    key={index}
                    className={cx(
                      ice === option
                        ? "productDetails__child__right__advanced__options__active"
                        : ""
                    )}
                    onClick={() => setIce(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={cx("productDetails__child__right__advanced__quality")}
            >
              <input
                type="number"
                value={quantity}
                readOnly
                className={cx(
                  "productDetails__child__right__advanced__quality__input"
                )}
              />
              <div
                className={cx(
                  "productDetails__child__right__advanced__quality__upDown"
                )}
              >
                <FontAwesomeIcon
                  icon={faCaretUp}
                  onClick={handleIncrease}
                  className={cx(
                    "productDetails__child__right__advanced__quality__upDown__iconUp"
                  )}
                />
                <FontAwesomeIcon
                  icon={faCaretDown}
                  onClick={handleDecrease}
                  className={cx(
                    "productDetails__child__right__advanced__quality__upDown__iconDown"
                  )}
                />
              </div>
            </div>

            <div
              className={cx("productDetails__child__right__advanced__cart")}
              onClick={handleAddCart}
            >
              <FontAwesomeIcon
                icon={faCartArrowDown}
                className={cx(
                  "productDetails__child__right__advanced__cart--icon"
                )}
                style={{ color: "white" }}
              />
              <strong>Add to cart</strong>
            </div>
          </div>
        </div>
      </div>
      {bool && (
        <ToastInformation
          content={content}
          title={title}
          bool={bool}
          setBool={setBool}
        />
      )}
    </div>
  );
}
ProductDetail.propTypes = {
  idProduct: PropTypes.string,
};

export default ProductDetail;
