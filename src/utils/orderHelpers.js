export const getOrderApiId = (order) => {
  if (!order) return null;
  const isDisplayId = (value) => typeof value === "string" && value.startsWith("INF-");

  return (
    order.orderId ||
    order.order_id ||
    order._id ||
    order.orderUuid ||
    order.uuid ||
    (!isDisplayId(order.id) ? order.id : null)
  );
};

export const getDisplayOrderNumber = (order) => {
  if (!order) return null;
  return order.orderNumber || order.displayOrderId || order.orderNo || order.id || 'N/A';
};
