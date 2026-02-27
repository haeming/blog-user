import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home.jsx";
import Layout from "../layout/Layout.jsx";
import PostsPage from "../pages/PostsPage.jsx";
import PostDetailPage from "../pages/PostDetailPage.jsx";

export function AppRouter(){
    return(
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/posts" element={<PostsPage/>}/>
                <Route path="/posts/:id" element={<PostDetailPage/>}/>
            </Route>
        </Routes>
    )
}