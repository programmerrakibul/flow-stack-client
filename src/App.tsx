import { router } from "@/routes/router";
import { RouterProvider } from "react-router";
import AuthLoader from "@/components/shared/auth-loader";

function App() {
  return (
    <AuthLoader>
      <RouterProvider router={router} />
    </AuthLoader>
  );
}

export default App;
