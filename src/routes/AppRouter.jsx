import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home.jsx";
import Layout from "../components/layout/Layout.jsx";

export function AppRouter(){
    return(
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<Home/>}/>
            </Route>
        </Routes>
    )
}