const menus = {
  label: "Chef Dashboard",
  items: [
    {
      label: "MealOrder",
      icon: "pi pi-fw pi-cart-plus",
      to: "/secure/mealOrder",
    },
    {
      label: "MealPrepare",
      icon: "pi pi-fw pi-box",
      to: "/secure/mealPrepare",
    },
    {
      label: "Delivery",
      icon: "pi pi-fw pi-map-marker",
      to: "/secure/delivery",
    },
    { label: "Feedback", icon: "pi pi-fw pi-comments", to: "/secure/feedback" },
    {
      label: "Notification",
      icon: "pi pi-fw pi-bell",
      to: "/secure/notification",
    },
  ],
};

export default menus;
