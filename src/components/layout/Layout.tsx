import Header from "../header/Header";
import SearchBar from "../searchBar/SearchBar";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";

function Layout(){
    return (
        <div>
            <Header/>
            <SearchBar/>
            <Outlet/>
            <Footer/>
        </div>
    )
};

export default Layout;
