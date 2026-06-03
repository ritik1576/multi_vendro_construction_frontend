export const getCartItemPrice = (item) => {
  const rawPrice = item?.discountPrice ?? item?.discountedPrice ?? item?.price ?? 0;

  console.log("CART ITEM:", item);
  console.log("RAW PRICE:", rawPrice);

  // "Rs. 270" -> 270
  const parsedPrice = Number(
    String(rawPrice).replace(/[^\d]/g, "")
  );

  console.log("PARSED PRICE:", parsedPrice);

  return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
};

export const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;