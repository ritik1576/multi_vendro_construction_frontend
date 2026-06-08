export const getCartItemPrice = (item) => {
  const rawPrice = item?.discountPrice ?? item?.discountedPrice ?? item?.price ?? 0;


  // "Rs. 270" -> 270
  const parsedPrice = Number(
    String(rawPrice).replace(/[^\d]/g, "")
  );


  return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
};

export const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;