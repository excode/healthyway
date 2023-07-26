const menus = {
  label: "لوحة معلومات المطبخ",
  items: [
    { label: "الطَّباخ", icon: "pi pi-fw pi-user", to: "/secure/chef" },
    {
      label: "الطَّباخ (المعرض)",
      // icon: "fa-sharp fa-light fa-hat-chef",
      icon: "pi pi-fw pi-images",
      to: "/secure/chef/dataview",
    },
    {
      label: "طَلبِية الوجبة",
      icon: "pi pi-fw pi-cart-plus",
      to: "/secure/mealOrder",
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
    { label: "العميل", icon: "pi pi-fw pi-id-card", to: "/secure/customer" },
    {
      label: "الاشتراك",
      icon: "pi pi-fw pi-dollar",
      to: "/secure/subscription",
    },
    {
      label: "العروض",
      icon: "pi pi-fw pi-percentage",
      to: "/secure/promotions",
    },
    {
      label: "العروض (المعرض)",
      icon: "pi pi-fw pi-images",
      to: "/secure/promotions/dataview",
    },
    {
      label: "تذكرة دعم العملاء",
      icon: "pi pi-fw pi-ticket",
      to: "/secure/customerSupport",
    },
    { label: "المطبخ", icon: "pi pi-fw pi-bookmark", to: "/secure/kitchen" },
    { label: "الوجبات", icon: "pi pi-fw pi-filter", to: "/secure/mealItem" },
    {
      label: "الوجبات (المعرض)",
      icon: " pi pi-fw pi-images",
      to: "/secure/mealItem/dataview",
    },
    {
      label: "الجرد",
      icon: "pi pi-fw pi-book",
      to: "/secure/inventory",
    },

    {
      label: "عناصر طلب الوجبة",
      icon: "pi pi-fw pi-check-circle",
      to: "/secure/mealOrderItem",
    },
    {
      label: "تكوين مكوّنات الوجبة",
      icon: "pi pi-fw pi-cog",
      to: "/secure/mealIngItem",
    },
    { label: "جدول المستخدم", icon: "pi pi-fw pi-users", to: "/secure/users" },
  ],
};

export default menus;
