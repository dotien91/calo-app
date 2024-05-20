import { sha1 } from "react-native-sha1";

/**
 * Xóa dấu cách, xuống dòng
 * @param string
 */
export function trim(string = ""): string {
  return String(string || " ")
    .trim()
    .replace(/(\r\n|\r|\n)+/g, "$1");
}

/**
 * Get SHA1 hash from string
 * @param string
 */
export async function getSha1FromString(string: string): Promise<string> {
  return sha1(string)
    .then(function returnResult(result) {
      return result;
    })
    .catch(function returnEmpty() {
      return "";
    });
}

/**
 * remove vietnamese tones
 * @param string
 */
export const removeVietnameseTones = (str: string) => {
  if (!str) {
    return "";
  }
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    // eslint-disable-next-line
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " ",
  );
  return str;
};

export const sliceString = (text: string, limit: number) => {
  return text.length < limit ? `${text}` : `${text.substring(0, limit)}...`;
};

export const formatPrice = (price?: number) => {
  if (price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  } else {
    if (price <= 0) return "FREE";
    else {
      return "";
    }
  }
};

export function formatCoin(
  amount,
  decimalCount = 0,
  decimal = ".",
  thousands = ",",
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 0 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    const i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
    ).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "") +
      " IHC"
    );
  } catch (e) {
    console.log(e);
  }
}
export const getPriceCourse = (item: any) => {
  let newPrice = formatPrice(item?.price);
  let oldPrice = formatPrice(item?.price);
  console.log(item?.type);
  if (
    item?.coupon_id == null ||
    item?.type === "Call group" ||
    item?.type === "Self-learning"
  ) {
    oldPrice = "";
  } else {
    if (item?.coupon_id?.promotion_type === "percentage") {
      newPrice = formatPrice(
        item?.price - (item?.price * item?.coupon_id?.promotion) / 100,
      );
    } else {
      newPrice = formatPrice(item?.price - item?.coupon_id?.promotion);
    }
  }
  return {
    newPrice: newPrice,
    oldPrice: oldPrice,
  };
};

export const formatPriceCourse = (data) => {
  let oldPrice = "";
  if (data.type === "Call group" || data.type === "Self-learning") {
    return {
      newPrice: "",
      oldPrice: formatPrice(data.price),
      commition: formatPrice(data.price / 5),
    };
  }
  if (data?.coupon_id) {
    if (
      (data?.coupon_id?.availableAt &&
        new Date(data?.coupon_id?.availableAt) > new Date()) ||
      (data?.coupon_id?.availableAt &&
        new Date(data?.coupon_id?.expired) < new Date())
    ) {
      return {
        newPrice: "",
        oldPrice: formatPrice(data.price),
        commition: formatPrice(data.price / 5),
      };
    } else {
      oldPrice = formatPrice(data.price);
      if (data?.coupon_id?.promotion_type === "percentage") {
        return {
          newPrice: formatPrice(
            data?.price - (data?.price * data?.coupon_id?.promotion) / 100,
          ),
          oldPrice: oldPrice,
          commition: formatPrice(
            (data?.price - (data?.price * data?.coupon_id?.promotion) / 100) /
              5,
          ),
        };
      } else {
        return {
          newPrice: formatPrice(data?.price - data?.coupon_id?.promotion),
          oldPrice: oldPrice,
          commition: formatPrice(
            (data?.price - data?.coupon_id?.promotion) / 5,
          ),
        };
      }
    }
  } else {
    return {
      newPrice: "",
      oldPrice: formatPrice(data.price),
      commition: formatPrice(data.price / 5),
    };
  }
};
