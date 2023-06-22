
    import { AppMenuItem } from "../types/layout";
    const menus={
        label: "Admin Dashboard",
        items: [
             { label: 'Chef', icon: 'pi pi-fw pi-id-card', to: '/secure/chef' },
 { label: 'Chef(Gallery)', icon: 'pi pi-fw pi-id-card', to: '/secure/chef/dataview' },
 { label: 'MealOrder', icon: 'pi pi-fw pi-id-card', to: '/secure/mealOrder' },
 { label: 'MealPrepare', icon: 'pi pi-fw pi-id-card', to: '/secure/mealPrepare' },
 { label: 'Delivery', icon: 'pi pi-fw pi-id-card', to: '/secure/delivery' },
 { label: 'Feedback', icon: 'pi pi-fw pi-id-card', to: '/secure/feedback' },
 { label: 'Notification', icon: 'pi pi-fw pi-id-card', to: '/secure/notification' },
 { label: 'Customer', icon: 'pi pi-fw pi-id-card', to: '/secure/customer' },
 { label: 'Subscription', icon: 'pi pi-fw pi-id-card', to: '/secure/subscription' },
 { label: 'Promotions', icon: 'pi pi-fw pi-id-card', to: '/secure/promotions' },
 { label: 'Promotions(Gallery)', icon: 'pi pi-fw pi-id-card', to: '/secure/promotions/dataview' },
 { label: 'Customer Support Ticket', icon: 'pi pi-fw pi-id-card', to: '/secure/customerSupport' },
 { label: 'Kitchen', icon: 'pi pi-fw pi-id-card', to: '/secure/kitchen' },
 { label: 'Meals', icon: 'pi pi-fw pi-id-card', to: '/secure/mealItem' },
 { label: 'Meals(Gallery)', icon: 'pi pi-fw pi-id-card', to: '/secure/mealItem/dataview' },
 { label: 'Inventory', icon: 'pi pi-fw pi-id-card', to: '/secure/inventory' },
 { label: 'Ingredient', icon: 'pi pi-fw pi-id-card', to: '/secure/ingredient' },
 { label: 'Ingredient(Gallery)', icon: 'pi pi-fw pi-id-card', to: '/secure/ingredient/dataview' },
 { label: 'Meal Group Name', icon: 'pi pi-fw pi-id-card', to: '/secure/mealGroup' },
 { label: 'Meal Group Name(Gallery)', icon: 'pi pi-fw pi-id-card', to: '/secure/mealGroup/dataview' },
 { label: 'Meal Order Items', icon: 'pi pi-fw pi-id-card', to: '/secure/mealOrderItem' },
 { label: 'Meal Ingredient Config', icon: 'pi pi-fw pi-id-card', to: '/secure/mealIngItem' },
 { label: 'User Table', icon: 'pi pi-fw pi-id-card', to: '/secure/users' }
        ],
    };
    
    export default menus;
            