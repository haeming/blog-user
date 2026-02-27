import { useEffect, useRef, useCallback } from 'react';

const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

const useScrollRestore = (key) => {
    const scrollY = useRef(Number(localStorage.getItem(`${key}_scroll`)) || 0);
    const pageNum = useRef(Number(localStorage.getItem(`${key}_page`)) || 0);

    const saveScroll = useCallback(
        debounce(() => {
            scrollY.current = window.pageYOffset;
        }, 100),
        []
    );

    useEffect(() => {
        window.addEventListener('scroll', saveScroll);
        return () => {
            window.removeEventListener('scroll', saveScroll);
            localStorage.setItem(`${key}_scroll`, String(scrollY.current));
            localStorage.setItem(`${key}_page`, String(pageNum.current));
        };
    }, []);

    const savePage = useCallback((p) => {
        pageNum.current = p;
    }, []);

    const clear = useCallback(() => {
        scrollY.current = 0;
        pageNum.current = 0;
        localStorage.removeItem(`${key}_scroll`);
        localStorage.removeItem(`${key}_page`);
    }, []);

    return {
        savedScroll: scrollY.current,
        savedPage: pageNum.current,
        savePage,
        clear,
    };
};

export default useScrollRestore;