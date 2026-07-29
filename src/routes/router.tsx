import DashboardLayout from "@/layouts/dashboard-layout";
import RootLayout from "@/layouts/root-layout";
import SignInPage from "@/pages/sign-in-page";
import SignUpPage from "@/pages/sign-up-page";
import AdminAllTasksPage from "@/pages/admin-all-tasks-page";
import AdminAllUsersPage from "@/pages/admin-all-users-page";
import DashboardOverview from "@/pages/dashboard-overview";
import ProfilePage from "@/pages/profile-page";
import HomePage from "@/pages/home-page";
import AddTaskPage from "@/pages/add-task-page";
import MyTasksPage from "@/pages/my-tasks-page";
import { Role } from "@/types/user";
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./protected-route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <DashboardOverview />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
              },
              {
                element: <ProtectedRoute allowedRoles={[Role.USER]} />,
                children: [
                  {
                    path: "add-task",
                    element: <AddTaskPage />,
                  },
                  {
                    path: "my-tasks",
                    element: <MyTasksPage />,
                  },
                ],
              },
              {
                element: <ProtectedRoute allowedRoles={[Role.ADMIN]} />,
                children: [
                  {
                    path: "all-tasks",
                    element: <AdminAllTasksPage />,
                  },
                  {
                    path: "all-users",
                    element: <AdminAllUsersPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
