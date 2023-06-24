const menus = {
  label: "Admin Dashboard",
  items: [

    
    
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
      label: "Ingredient",
      icon: "pi pi-fw pi-align-center",
      to: "/secure/ingredient",
    },
    {
      label: "Ingredient(Gallery)",
      icon: "pi pi-fw pi-images",
      to: "/secure/ingredient/dataview",
    },
    {
      label: "Meal Group Name",
      icon: "pi pi-fw pi-clone",
      to: "/secure/mealGroup",
    },
    {
      label: "Meal Group Name(Gallery)",
      icon: "pi pi-fw pi-images",
      to: "/secure/mealGroup/dataview",
    },
    
    { label: "User Table", icon: "pi pi-fw pi-users", to: "/secure/users" },
  ],
};

export default menus;
