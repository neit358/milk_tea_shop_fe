import classNames from "classnames/bind";
import style from "./ProductDetailCollection.module.scss";

const cx = classNames.bind(style);
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function ProductDetailCollection({ option, setTopping, topping }) {
  const [quantity, setQuantity] = useState(0);

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    if (quantity === 0) {
      setTopping(topping.filter((item) => item.topping !== option.topping._id));
    } else {
      setTopping([
        ...topping.filter((item) => item.topping !== option.topping._id),
        {
          topping: option.topping._id,
          soLuong: quantity,
          giaThem: option.giaThem,
        },
      ]);
    }
  }, [quantity]);

  return (
    <div className={cx("productDetailCollection")}>
      <div className={cx("productDetailCollection__toppingInfo")}>
        <span>{option.topping.tenTopping}</span>
        <span>{option.giaThem} đ</span>
      </div>
      <div className={cx("productDetailCollection__toppingQuantity")}>
        <button
          className={cx(
            "productDetailCollection__toppingQuantity__quantityBtn"
          )}
          onClick={handleDecreaseQuantity}
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
          onClick={handleIncreaseQuantity}
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
};

export default ProductDetailCollection;
