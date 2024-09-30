import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { UserProvider } from "./contexts/UserContext";
import Home from "./pages/home/Home";
import Explore from "./pages/explore/Explore";
import About from "./pages/about/About";
import Profile from "./pages/profile/Profile";
import MyProfile from "./pages/myProfile/MyProfile";
import Venues from "./pages/venues/Venues";
import VenueDetails from "./pages/venueDetails/VenueDetails";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

function App() {
  return (
    <UserProvider>
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
            <Route path="venues" element={<Venues />} />
            <Route path="venues/:id" element={<VenueDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
