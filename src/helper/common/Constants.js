export const SIDE_BAR_CONFIG =  [
    {
      title: "Dashboard",
      main: true,
      path: "/",
      icon: "solar:home-smile-angle-outline",
      children: []
    },
    {
      title: "Users",
      path: "#",
      icon: "flowbite:users-group-outline",
      children: [
        {
          title: "Users List",
          path: "/users-list"
          
        },
        {
          title: "Add User",
          path: "/add-user"
        },
        {
          title: "View User Profile",
          path: "/view-profile"
        },
        {
            title: "Delete User",
            path:"/delete-user",
            hide: true
        },
        {
            title: "Edit User",
            path:"/edit-user",
            hide: true
        },
        {
            title: "Activate/Block User",
            path:"/activate-block-user",
            hide: true
        },
        
      ]
    },
    {
      title: "Role & Access",
      path: "#",
      icon: "flowbite:users-group-outline",
      children: [
        {
            title: "Roles List",
            path: "/roles-list"
        },
        {
            title: "Add Role",
            path: "/add-role"
        },
        {
            title: "Edit Role",
            path: "/edit-role"
        },
        {
          title: "Assign Role",
          path: "/assign-role"
        },
        {
            title: "Delete Role",
            path:"/delete-role",
            hide: true
        }
      ]
    },
    {
      title: "Review Managment",
      path: "#",
      icon: "flowbite:star-outline",
      children: [
        {
          title: "Reviews List",
          path: "/reviews-list"
        },
        
        {
            title: "Review Details",
            path:"/review-details",
            hide: true
        },
        {
            title: "Delete Review",
            path:"/delete-review",
            hide: true
        },
        {
            title: "Approve/Reject Review",
            path:"/approve-reject-review",
            hide: true
        }
      ]
    },
    {
      title: "Categories",
      path: "#",
      icon: "flowbite:restore-window-outline",
      children: [
        {
          title: "Categories List",
          path: "/categories-list"
        },
        {
          title: "Add Category",
          path: "/add-category"
        },
        {
          title: "Edit Category",
          path: "/edit-category"
        },
        {
            title: "Delete Category",
            path:"/delete-category",
            hide: true
        }
      ]
    },
    {
      title: "Sub-categories",
      path: "#",
      icon: "flowbite:restore-window-outline",
      children: [
        {
          title: "Sub-categories List",
          path: "/sub-categories-list"
        },
        {
          title: "Add Sub-category",
          path: "/add-sub-category"
        },
        {
          title: "Edit Sub-category",
          path: "/edit-sub-category"
        },
        {
            title: "Delete Sub-category",
            path:"/delete-sub-category",
            hide: true
        }
      ]
    },
    {
      title: "Rating Parameters",
      path: "#",
      icon: "flowbite:ordered-list-outline",
      children: [
        {
          title: "Rating Parameters List",
          path: "/rating-parameter-list"
        },
        {
          title: "Add Rating Parameter",
          path: "/add-rating-parameter"
        },
        {
          title: "Edit Rating Parameter",
          path: "/edit-rating-parameter"
        },
        {
            title: "Delete Rating Parameter",
            path:"/delete-rating-parameter",
            hide: true
        }
      ]
    },
]
