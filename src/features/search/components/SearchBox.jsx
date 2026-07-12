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
            <div className="search-box-field">
                <button className="search-box-icon-btn" type="submit" aria-label="검색">
                    <svg className="search-box-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </button>
                <input
                    className="search-box-input"
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
        </form>
    );
}
