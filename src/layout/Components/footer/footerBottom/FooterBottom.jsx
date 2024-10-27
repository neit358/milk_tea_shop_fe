import styles from "./FooterBottom.module.scss";
import classNames from "classnames/bind";

import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconLogo } from "~/Components/Icons";
import { SocialIcon } from "react-social-icons";

const cx = classNames.bind(styles);

function FooterBottom() {
  return (
    <div className={cx("footer__bottom")}>
      <div className={cx("wrapper")}>
        <div className={cx("footer__bottom__details")}>
          <div className={cx("footer__bottom__details__contact")}>
            <div className={cx("footer__bottom__details__contact__top")}>
              <div
                className={cx("footer__bottom__details__contact__top__logo")}
              >
                <IconLogo width="156px" height="37px" />
              </div>
              <div
                className={cx(
                  "footer__bottom__details__contact__top__phoneNum"
                )}
              >
                <div
                  className={cx(
                    "footer__bottom__details__contact__top__phoneNum__left"
                  )}
                >
                  <FontAwesomeIcon
                    icon={faPhoneVolume}
                    className={cx(
                      "footer__bottom__details__contact__top__phoneNum__left--icon"
                    )}
                  />
                  <i
                    className={cx(
                      "fa-solid fa-phone-volume footer__bottom__details__contact__top__phoneNum__left--icon"
                    )}
                  ></i>
                </div>
                <div
                  className={cx(
                    "footer__bottom__details__contact__top__phoneNum__right"
                  )}
                >
                  <div
                    className={cx(
                      "footer__bottom__details__contact__top__phoneNum__right__top"
                    )}
                  >
                    Got Questions ? Call us 24/7!
                  </div>
                  <div
                    className={cx(
                      "footer__bottom__details__contact__top__phoneNum__right__bottom"
                    )}
                  >
                    (+85) 353356230, (+85) 123456789
                  </div>
                </div>
              </div>
            </div>
            <div
              className={cx("footer__bottom__details__contact__socialNetwork")}
            >
              <div
                className={cx(
                  "footer__bottom__details__contact__socialNetwork__address"
                )}
              >
                <div
                  className={cx(
                    "footer__bottom__details__contact__socialNetwork__address__top"
                  )}
                >
                  <strong>Contact Info</strong>
                </div>
                <div
                  className={cx(
                    "footer__bottom__details__contact__socialNetwork__address__bottom"
                  )}
                >
                  Cộng Hòa, Phường 14, Tân Bình, TPHCM
                </div>
              </div>
              <div
                className={cx(
                  "footer__bottom__details__contact__socialNetwork__social"
                )}
              >
                <SocialIcon
                  url="https://www.facebook.com/Nguyendinhtien08052003/"
                  className={cx(
                    "footer__bottom__details__contact__socialNetwork__social--icon",
                    "fb"
                  )}
                />
                <SocialIcon
                  url="https://www.youtube.com/channel/UCJJjTAUzkj-EZmErUIk1bdA"
                  className={cx(
                    "footer__bottom__details__contact__socialNetwork__social--icon",
                    "yt"
                  )}
                />
                <SocialIcon
                  url="https://www.instagram.com/tien_oceee/"
                  className={cx(
                    "footer__bottom__details__contact__socialNetwork__social--icon",
                    "in"
                  )}
                />
              </div>
            </div>
          </div>
          <div className={cx("footer__bottom__details__care")}>
            <div className={cx("footer__bottom__details__care__content")}>
              <strong>Customer Care</strong>
            </div>
            <ul className={cx("footer__bottom__details__care__list")}>
              <li className={cx("footer__bottom__details__care__list___child")}>
                My Account
              </li>
              <li className={cx("footer__bottom__details__care__list___child")}>
                Track your Order
              </li>
              <li className={cx("footer__bottom__details__care__list___child")}>
                Customer Service
              </li>
              <li className={cx("footer__bottom__details__care__list___child")}>
                Returns/Exchange
              </li>
              <li className={cx("footer__bottom__details__care__list___child")}>
                FAQs
              </li>
              <li className={cx("footer__bottom__details__care__list___child")}>
                Product Support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterBottom;
