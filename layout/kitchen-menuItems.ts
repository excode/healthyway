const menus = {
  label: "Kitchen Dashboard",
  items: [
    { label: "Chef", icon: "pi pi-fw pi-user", to: "/secure/chef" },
    {
      label: "Chef(Gallery)",
      // icon: "fa-sharp fa-light fa-hat-chef",
      icon: "pi pi-fw pi-images",
      to: "/secure/chef/dataview",
    },
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
    { label: "Customer", icon: "pi pi-fw pi-id-card", to: "/secure/customer" },
    {
      label: "Subscription",
      icon: "pi pi-fw pi-dollar",
      to: "/secure/subscription",
    },
    {
      label: "Promotions",
      icon: "pi pi-fw pi-percentage",
      to: "/secure/promotions",
    },
    {
      label: "Promotions(Gallery)",
      icon: "pi pi-fw pi-images",
      to: "/secure/promotions/dataview",
    },
    {
      label: "Customer Support Ticket",
      icon: "pi pi-fw pi-ticket",
      to: "/secure/customerSupport",
    },
    { label: "Kitchen", icon: "pi pi-fw pi-bookmark", to: "/secure/kitchen" },
    { label: "Meals", icon: "pi pi-fw pi-filter", to: "/secure/mealItem" },
    {
      label: "Meals(Gallery)",
      icon: " pi pi-fw pi-images",
      to: "/secure/mealItem/dataview",
    },
    {
      label: "Inventory",
      icon: "pi pi-fw pi-book",
      to: "/secure/inventory",
    },
    
    
    {
      label: "Meal Order Items",
      icon: "pi pi-fw pi-check-circle",
      to: "/secure/mealOrderItem",
    },
    {
      label: "Meal Ingredient Config",
      icon: "pi pi-fw pi-cog",
      to: "/secure/mealIngItem",
    },
    { label: "User Table", icon: "pi pi-fw pi-users", to: "/secure/users" },
  ],
};

export default menus;
