export const mockNotifications = {
  customer: [
    {
      id: 'c1',
      type: 'Orders',
      title: 'Order Confirmed',
      message: 'Your order #ORD-12345 has been confirmed and is being processed.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
      isRead: false,
      cta: { text: 'View Order', link: '/orders' }
    },
    {
      id: 'c2',
      type: 'Delivery',
      title: 'Out for Delivery',
      message: 'Your order #ORD-12342 is out for delivery and will arrive by 5 PM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      isRead: false,
      cta: { text: 'Track Order', link: '/orders' }
    },
    {
      id: 'c3',
      type: 'Payment',
      title: 'Payment Successful',
      message: 'Payment of ₹45,000 for order #ORD-12345 was successful.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      isRead: true,
    },
    {
      id: 'c4',
      type: 'System',
      title: 'Welcome to InfraMart',
      message: 'Thank you for registering. Start exploring our wide range of construction materials.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      isRead: true,
    },
  ],
  vendor: [
    {
      id: 'v1',
      type: 'Orders',
      title: 'New Order Received',
      message: 'You have received a new order #ORD-12345 for 500 bags of Cement.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      isRead: false,
      cta: { text: 'View Order', link: '/vendor/orders' }
    },
    {
      id: 'v2',
      type: 'Inventory',
      title: 'Low Stock Alert',
      message: 'Your inventory for "TMT Bars 12mm" is running low (only 15 left).',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      isRead: false,
      cta: { text: 'Manage Inventory', link: '/vendor/inventory' }
    },
    {
      id: 'v3',
      type: 'Admin',
      title: 'Approval Successful',
      message: 'Congratulations! Your vendor profile has been approved.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      isRead: true,
    },
  ],
  admin: [
    {
      id: 'a1',
      type: 'Admin',
      title: 'New Vendor Registration',
      message: 'ABC Constructions has registered and is pending approval.',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      isRead: false,
      cta: { text: 'Review Vendor', link: '/admin/vendors' }
    },
    {
      id: 'a2',
      type: 'System',
      title: 'High Server Load',
      message: 'The server is experiencing higher than normal traffic.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: false,
    },
    {
      id: 'a3',
      type: 'Orders',
      title: 'Order Issue Reported',
      message: 'Customer raised a dispute for order #ORD-11223.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      isRead: true,
      cta: { text: 'View Order', link: '/admin/orders' }
    },
    {
      id: 'a4',
      type: 'System',
      title: 'Weekly Report Generated',
      message: 'The weekly sales and vendor report is ready for review.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      isRead: true,
      cta: { text: 'View Reports', link: '/admin/reports' }
    },
  ],
};
