const menus = {
  label: "لوحة معلومات الطَّباخ",
  items: [
    {
      label: "طَلبِية الوجبة",
      icon: "pi pi-fw pi-cart-plus",
      to: "/secure/mealOrder",
    },
    {
      label: "الوجبة جاهزة للتوصيل",
      icon: "pi pi-fw pi-sync",
      to: "/secure/mealReadyToDelivered",
    },
    {
      label: "تحضير الوجبة",
      icon: "pi pi-fw pi-box",
      to: "/secure/mealPrepare",
    },
    {
      label: "التوصيل",
      icon: "pi pi-fw pi-map-marker",
      to: "/secure/delivery",
    },
    {
      label: "التعليقات",
      icon: "pi pi-fw pi-comments",
      to: "/secure/feedback",
    },
    {
      label: "الإشعارات",
      icon: "pi pi-fw pi-bell",
      to: "/secure/notification",
    },
  ],
};

export default menus;
