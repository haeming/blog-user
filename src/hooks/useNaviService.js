import {useNavigate} from "react-router-dom";

export default function useNaviService(){
    const navigate = useNavigate();

    const goToBack = () => {
        navigate(-1);
    }

    const goToHome = () => {
        navigate("/");
    }

    const goToPosts = (url) => {
        navigate(url || "/posts");
    }

    const goToPost = (id, state) => {
        navigate(`/posts/${id}`, state ? { state } : undefined);
    }

    const goToCategory = (categoryId) => {
        navigate(`/posts?category=${categoryId}`);
    }

    return {goToBack, goToHome, goToPosts, goToPost, goToCategory};
}
