import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Image.module.scss";
import { images } from "../../assets/images";

const Image = forwardRef(
  ({ src, alt, className, fallbackImage = images.noImage, ...props }, ref) => {
    const [fallback, setFallBack] = useState("");
    const handleOnError = () => {
      setFallBack(fallbackImage);
    };
    return (
      <img
        src={fallback || src}
        className={classNames(styles.image, className)}
        alt={alt}
        ref={ref}
        {...props}
        onError={handleOnError}
      />
    );
  }
);

Image.displayName = "Image";

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallbackImage: PropTypes.string,
};

export default Image;
