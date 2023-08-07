const menus = {
  label: "CHEF_DASHBOARD",
  items: [
    {
      label: "MEAL_ORDER",
      icon: "pi pi-fw pi-cart-plus",
      to: "/secure/mealOrder",
    },
    {
      label: "PACKAGING",
      icon: "pi pi-fw pi-sync",
      to: "/secure/packaging",
    },
    {
      label: "MEAL_READY_TO_DELIVERED",
      icon: "pi pi-fw pi-check-circle",
      to: "/secure/mealReadyToDelivered",
    },
    {
      label: "MEAL_PREPARE",
      icon: "pi pi-fw pi-box",
      to: "/secure/mealPrepare",
    },
    {
      label: "DELIVERY",
      icon: "pi pi-fw pi-map-marker",
      to: "/secure/delivery",
    },
    { label: "FEEDBACK", icon: "pi pi-fw pi-comments", to: "/secure/feedback" },
    {
      label: "NOTIFICATION",
      icon: "pi pi-fw pi-bell",
      to: "/secure/notification",
    },
  ],
};

export default menus;
