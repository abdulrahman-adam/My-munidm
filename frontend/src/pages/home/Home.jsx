import { Layout } from "lucide-react";
import ProtectedRoute from "../../components/protectedRoute/ProtectedRoute";
import { useAppContext } from "../../context/AppContext";
import Login from "../auth/Login";
import Dashboard from "../dashboard/Dashboard";


function Home() {
  const { user } = useAppContext();

  if (!user) {
    return <Login />;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  );
}

export default Home;