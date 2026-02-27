import {useNavigate} from "react-router-dom";

export default function useNaviService(){
    const navigate = useNavigate();

    const goToBack = () => {
        navigate(-1);
    }

    const goToHome = () => {
        navigate("/");
    }

    const goToPosts = (state) => {
        navigate("/posts", state ? { state } : undefined);
    }

    const goToPost = (id, state) => {
        navigate(`/posts/${id}`, state ? { state } : undefined);
    }

    return {goToBack, goToHome, goToPosts, goToPost};
}
