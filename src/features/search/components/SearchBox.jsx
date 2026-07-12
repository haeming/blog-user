import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useNaviService from "../../../hooks/useNaviService.js";
import "./SearchBox.css";

export default function SearchBox() {
    const naviService = useNaviService();
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get("search") ?? "");

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = keyword.trim();
        if (!trimmed) return;
        naviService.goToPosts(`/posts?search=${encodeURIComponent(trimmed)}`);
    };

    return (
        <form className="search-box" onSubmit={handleSubmit}>
            <input
                className="search-box-input"
                type="text"
                placeholder="검색어를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button className="search-box-btn" type="submit" aria-label="검색">
                🔍
            </button>
        </form>
    );
}
