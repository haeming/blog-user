import {useNavigate} from "react-router-dom";

export default function useNaviService(){
    const navigate = useNavigate();

    const goToBack = () => {
        navigate(-1);
    }

    const goToHome = () => {
        navigate("/");
    }

    const goToPosts = () => {
        navigate("/posts");
    }

    const goToPost = (id) => {
        navigate(`/posts/${id}`);
    }

    const goToCategory = (categoryId) => {
        navigate(`/posts?category=${categoryId}`);
    }

    return {goToBack, goToHome, goToPosts, goToPost, goToCategory};
}
