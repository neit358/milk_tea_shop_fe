import classNames from "classnames/bind";
import style from "./ProductDetail.module.scss";
import {
  faCaretDown,
  faCaretUp,
  faCartArrowDown,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ToastInformation from "~/Components/Notification";
import { useParams } from "react-router-dom";
import Image from "../../Components/Image/Image";
import * as productService from "../../services/product.service";
import numeral from "numeral";

const cx = classNames.bind(style);

function ProductDetail() {
  const [bool, setBool] = useState(false);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("Size M");
  const [sweetness, setSweetness] = useState("Bình thường");
  const [ice, setIce] = useState("Bình thường");
  const content = "Sample content";
  const title = "Sample title";
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await productService.getProduct(id);
      if (response.data.success) {
        setProduct(response.data.result);
      }
    };
    fetchData();
  }, [id]);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  return (
    <div className={cx("productDetails", "grid__column-10")}>
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
                {product.kichThuoc?.map((option, index) => (
                  <button
                    key={index}
                    className={cx(
                      "productDetails__child__right__advanced__options__selection__size",
                      size === option.tenKichThuoc.tenKichThuoc
                        ? "productDetails__child__right__advanced__options__active"
                        : ""
                    )}
                    onClick={() => setSize(option.tenKichThuoc.tenKichThuoc)}
                  >
                    <label>{option.tenKichThuoc.tenKichThuoc}</label>
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

            <div
              className={cx("productDetails__child__right__advanced__options")}
            >
              <h3>Đá</h3>
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

            <div className={cx("productDetails__child__right__advanced__cart")}>
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

export default ProductDetail;
