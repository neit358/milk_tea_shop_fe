import classNames from "classnames/bind";
import style from "./ProductDetailCollection.module.scss";

const cx = classNames.bind(style);
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function ProductDetailCollection({ option, setTopping, topping, cartItem }) {
  const [quantity, setQuantity] = useState(
    cartItem?.thongTinTopping?.find(
      (topping) => topping.topping._id === option._id
    )?.soLuong || 0
  );

  useEffect(() => {
    if (quantity === 0) {
      setTopping(topping.filter((item) => item.topping !== option._id));
    } else {
      setTopping([
        ...topping.filter((item) => item.topping !== option._id),
        {
          topping: option._id,
          soLuong: quantity,
        },
      ]);
    }
  }, [quantity]);

  return (
    <div className={cx("productDetailCollection")}>
      <div className={cx("productDetailCollection__toppingInfo")}>
        <span>{option.tenTopping}</span>
        <span>{option.gia} đ</span>
      </div>
      <div className={cx("productDetailCollection__toppingQuantity")}>
        <button
          className={cx(
            "productDetailCollection__toppingQuantity__quantityBtn"
          )}
          onClick={() => {
            if (quantity > 0) {
              setQuantity(quantity - 1);
            }
          }}
        >
          -
        </button>
        <span
          className={cx("productDetailCollection__toppingQuantity__quantity")}
        >
          {quantity}
        </span>
        <button
          className={cx(
            "productDetailCollection__toppingQuantity__quantityBtn"
          )}
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
ProductDetailCollection.propTypes = {
  option: PropTypes.object.isRequired,
  setTopping: PropTypes.func.isRequired,
  topping: PropTypes.array.isRequired,
  cartItem: PropTypes.object,
};

export default ProductDetailCollection;
