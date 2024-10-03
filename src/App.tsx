import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { UserProvider } from "./contexts/UserContext";
import Home from "./pages/home/Home";
import Explore from "./pages/explore/Explore";
import About from "./pages/about/About";
import Profile from "./pages/profile/Profile";
import MyProfile from "./pages/myProfile/MyProfile";
import VenueDetails from "./pages/venueDetails/VenueDetails";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

const queryClient = new QueryClient();

function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="myProfile" element={<MyProfile />} />
              <Route path="venueDetails/:id" element={<VenueDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;