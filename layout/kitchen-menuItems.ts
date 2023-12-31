const menus = {
  label: "KITCHEN_DASHBOARD",
  items: [
    { label: "CHEF", icon: "pi pi-fw pi-user", to: "/secure/chef" },
    {
      label: "CHEF_GALLERY",
      // icon: "fa-sharp fa-light fa-hat-chef",
      icon: "pi pi-fw pi-images",
      to: "/secure/chef/dataview",
    },
    {
      label: "MEAL_ORDER",
      icon: "pi pi-fw pi-cart-plus",
      to: "/secure/mealOrder",
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
    { label: "CUSTOMER", icon: "pi pi-fw pi-id-card", to: "/secure/customer" },
    {
      label: "SUBSCRIPTION",
      icon: "pi pi-fw pi-dollar",
      to: "/secure/subscription",
    },
    {
      label: "PROMOTIONS",
      icon: "pi pi-fw pi-percentage",
      to: "/secure/promotions",
    },
    {
      label: "PROMOTIONS_GALLERY",
      icon: "pi pi-fw pi-images",
      to: "/secure/promotions/dataview",
    },
    {
      label: "CUSTOMER_SUPPORT_TICKET",
      icon: "pi pi-fw pi-ticket",
      to: "/secure/customerSupport",
    },
    { label: "KITCHEN", icon: "pi pi-fw pi-bookmark", to: "/secure/kitchen" },
    { label: "MEALS", icon: "pi pi-fw pi-filter", to: "/secure/mealItem" },
    {
      label: "MEALS_GALLERY",
      icon: " pi pi-fw pi-images",
      to: "/secure/mealItem/dataview",
    },
    {
      label: "INVENTORY",
      icon: "pi pi-fw pi-book",
      to: "/secure/inventory",
    },
    
    
    {
      label: "MEAL_ORDER_ITEMS",
      icon: "pi pi-fw pi-check-circle",
      to: "/secure/mealOrderItem",
    },
    {
      label: "MEAL_INGREDIENT_CONFIG",
      icon: "pi pi-fw pi-cog",
      to: "/secure/mealIngItem",
    },
    { label: "USER_TABLE", icon: "pi pi-fw pi-users", to: "/secure/users" },
  ],
};

export default menus;
