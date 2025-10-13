import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login.tsx";
import PrivateLayout from "./components/PrivateLayout.tsx";
import Home from "./pages/Home.tsx";
import SiteMaintenance from "./pages/maintenance/SiteMaintenance.tsx";
import MembershipMaintenance from "./pages/maintenance/MembershipMaintenance.tsx";
import TrainingMaintenance from "./pages/maintenance/TrainingMaintenance.tsx";
import UserMaintenance from "./pages/maintenance/UserMaintenance.tsx";

function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<PrivateLayout />}>
                      <Route path={"/home"} element={<Home />}/>
                      <Route path={"/user"} element={<UserMaintenance />}/>
                      <Route path={"/site"} element={<SiteMaintenance />}/>
                      <Route path={"/membership"} element={<MembershipMaintenance />}/>
                      <Route path={"/training"} element={<TrainingMaintenance />}/>
                  </Route>
                  <Route path="/" element={<Navigate to="/home" />} />
              </Routes>
          </BrowserRouter>
      </AuthProvider>
  )
}

export default App
