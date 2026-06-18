import { useEffect, useState } from "react";
import categoryApi from "../../../api/categoryApi.js";
import useNaviService from "../../../hooks/useNaviService.js";
import { useSearchParams } from "react-router-dom";
import "./CategoryList.css";

export default function CategoryList() {
    const { getCategories } = categoryApi();
    const [categories, setCategories] = useState([]);
    const naviService = useNaviService();
    const [searchParams] = useSearchParams();
    const activeCategoryId = searchParams.get("category");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error("카테고리 목록 불러오기 에러", e);
            }
        };
        fetchCategories();
    }, []);

    if (!categories.length) return null;

    return (
        <div className="category-list-container">
            <div className="category-list-title">CATEGORY</div>
            <div className="category-list">
                <div
                    className={`category-list-item ${!activeCategoryId ? "active" : ""}`}
                    onClick={() => naviService.goToPosts()}
                >
                    전체보기
                </div>
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className={`category-list-item ${String(cat.id) === activeCategoryId ? "active" : ""}`}
                        onClick={() => naviService.goToCategory(cat.id)}
                    >
                        {cat.categoryName}
                    </div>
                ))}
            </div>
        </div>
    );
}
