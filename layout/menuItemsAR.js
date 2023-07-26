const menus = {
  label: "لوحة معلومات الإداري",
  items: [
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
      label: "المكوّن",
      icon: "pi pi-fw pi-align-center",
      to: "/secure/ingredient",
    },
    {
      label: "المكوّن (المعرض)",
      icon: "pi pi-fw pi-images",
      to: "/secure/ingredient/dataview",
    },
    {
      label: "اسم مجموعة ال",
      icon: "pi pi-fw pi-clone",
      to: "/secure/mealGroup",
    },
    {
      label: "اسم مجموعة ال",
      icon: "pi pi-fw pi-images",
      to: "/secure/mealGroup/dataview",
    },

    { label: "جدول المستخدم", icon: "pi pi-fw pi-users", to: "/secure/users" },
  ],
};

export default menus;
