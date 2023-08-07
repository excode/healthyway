const menus = {
  label: "ADMIN_DASHBOARD",
  items: [
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
      label: "INGREDIENT_GALLERY",
      icon: "pi pi-fw pi-align-center",
      to: "/secure/ingredient",
    },
    
    {
      label: "MEAL_GROUP_NAME",
      icon: "pi pi-fw pi-clone",
      to: "/secure/mealGroup",
    },
    

    { label: "USER_TABLE", icon: "pi pi-fw pi-users", to: "/secure/users" },
  ],
};

export default menus;
