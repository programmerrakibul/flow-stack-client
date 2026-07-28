import ProviderWrapper from "@/providers/provider-wrapper";
import { router } from "@/routes/router";
import { RouterProvider } from "react-router";

function App() {
  return (
    <>
      <ProviderWrapper>
        <RouterProvider router={router} />
      </ProviderWrapper>
    </>
  );
}

export default App;
