// const menus = {
//   label: `${t("ADMIN_DASHBOARD")}`,
//   items: [
//     {
//       label: `${t("FEEDBACK")}`,
//       icon: "pi pi-fw pi-comments",
//       to: "/secure/feedback",
//     },
//     {
//       label: `${t("NOTIFICATION")}`,
//       icon: "pi pi-fw pi-bell",
//       to: "/secure/notification",
//     },
//     {
//       label: `${t("CUSTOMER")}`,
//       icon: "pi pi-fw pi-id-card",
//       to: "/secure/customer",
//     },
//     {
//       label: `${t("SUBSCRIPTION")}`,
//       icon: "pi pi-fw pi-dollar",
//       to: "/secure/subscription",
//     },
//     {
//       label: `${t("PROMOTIONS")}`,
//       icon: "pi pi-fw pi-percentage",
//       to: "/secure/promotions",
//     },
//     {
//       label: `${t("PROMOTIONS_GALLERY")}`,
//       icon: "pi pi-fw pi-images",
//       to: "/secure/promotions/dataview",
//     },
//     {
//       label: `${t("CUSTOMER_SUPPORT_TICKET")}`,
//       icon: "pi pi-fw pi-ticket",
//       to: "/secure/customerSupport",
//     },
//     {
//       label: `${t("KITCHEN")}`,
//       icon: "pi pi-fw pi-bookmark",
//       to: "/secure/kitchen",
//     },
//     {
//       label: `${t("MEALS")}`,
//       icon: "pi pi-fw pi-filter",
//       to: "/secure/mealItem",
//     },
//     {
//       label: `${t("MEALS_GALLERY")}`,
//       icon: " pi pi-fw pi-images",
//       to: "/secure/mealItem/dataview",
//     },

//     {
//       label: `${t("INGREDIENT")}`,
//       icon: "pi pi-fw pi-align-center",
//       to: "/secure/ingredient",
//     },
//     {
//       label: `${t("INGREDIENT_GALLERY")}`,
//       icon: "pi pi-fw pi-images",
//       to: "/secure/ingredient/dataview",
//     },
//     {
//       label: `${t("MEAL_GROUP_NAME")}`,
//       icon: "pi pi-fw pi-clone",
//       to: "/secure/mealGroup",
//     },
//     {
//       label: `${t("MEAL_GROUP_NAME_GALLERY")}`,
//       icon: "pi pi-fw pi-images",
//       to: "/secure/mealGroup/dataview",
//     },

//     {
//       label: `${t("USER_TABLE")}`,
//       icon: "pi pi-fw pi-users",
//       to: "/secure/users",
//     },
//   ],
// };

// export default menus;
// export async function getStaticProps(context: any) {
//   // extract the locale identifier from the URL
//   const { locale } = context;

//   return {
//     props: {
//       // pass the translation props to the page component
//       ...(await serverSideTranslations(locale)),
//     },
//   };
// }

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
