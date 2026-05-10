import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import CommonLayout from '../../components/shop/common-layout';
import { Container, Row, Col } from 'reactstrap';
import { searchProducts } from '@/actions/products';
import { useLanguage } from '@/helpers/Language/useLanguage';
import { addToCart as addToCartAction } from '@/actions/cart';
import CartContext from '@/helpers/cart/CartContext';
import { WishlistContext } from '@/helpers/wishlist/WishlistContext';
import { CompareContext } from '@/helpers/Compare/CompareContext';
import ProductCardUnified from '@/components/products/productCard';
import { useProductAdapter } from '@/components/products/useProductAdapter';
import PostLoader from '@/components/common/PostLoader';

/* ---------- helpers ---------- */
const productKey = (p) => {
    const raw = p?.raw || p;
    const id = raw?.id ?? raw?.sku ?? raw?.code ?? raw?.slug ?? raw?.uuid;
    const mainImg = raw?.image_path || p?.images?.[0]?.src || '';
    return String(id ?? '') + '|' + String(mainImg ?? '');
};

/* ============================== COMPONENT ============================== */
const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { t, isRTL } = useLanguage();
    const cartContext = useContext(CartContext);
    const wishlistContext = useContext(WishlistContext);
    const compareContext = useContext(CompareContext);
    const { adapt } = useProductAdapter(isRTL);

    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const debounceTimer = useRef(null);

    /* ---------- i18n helper ---------- */
    const tr = (key, ar, en) => {
        try { const v = t?.(key); if (v && v !== key) return v; } catch { }
        return isRTL ? ar : en;
    };

    /* ---------- search ---------- */
    const runSearch = useCallback(async (value) => {
        if (!value.trim()) return;
        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const raw = await searchProducts(value);
            const list = Array.isArray(raw) ? raw : raw?.data || raw?.items || [];
            setResults(list.map((p) => adapt(p)));
        } catch (err) {
            console.error(err);
            setError(tr('search_error', 'حدث خطأ أثناء البحث. حاول مرة أخرى.', 'An error occurred. Please try again.'));
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [adapt, isRTL]);

    /* run whenever URL ?q= changes */
    useEffect(() => {
        const q = searchParams.get('q') || '';
        setQuery(q);
        if (q.trim()) runSearch(q);
        else { setResults([]); setSearched(false); }
    }, [searchParams]);

    /* ---------- input handlers ---------- */
    const onChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setSearchParams(value.trim() ? { q: value } : {});
        }, 400);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) setSearchParams({ q: query });
    };

    /* ✅ toast واحد بس — local أولاً، server في الخلفية بصمت */
    const addToCartBoth = useCallback(async (product, qty = 1) => {
        // local أولاً → CartProvider يعمل toast "تمت الإضافة بنجاح"
        cartContext?.addToCart?.(product, qty);

        // server في الخلفية — بدون أي toast إضافي
        try {
            const weight = product?.raw?.weight || '';
            await addToCartAction(product.id, qty, weight);
            cartContext?.refetch?.();
        } catch (err) {
            console.warn('Server cart sync failed (non-critical):', err);
        }
    }, [cartContext]);

    /* ---------- render ---------- */
    return (
        <CommonLayout parent="home" title="search">
            <section className="authentication-page section-b-space">
                <Container>

                    {/* ── Search bar ── */}
                    <section className="search-block">
                        <Container>
                            <Row>
                                <Col lg="6" className="offset-lg-3">
                                    <form className="form-header" onSubmit={onSubmit}>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={tr('search_placeholder', 'ابحث عن المنتجات...', 'Search Products...')}
                                                value={query}
                                                onChange={onChange}
                                                autoFocus
                                                dir={isRTL ? 'rtl' : 'ltr'}
                                            />
                                            <button type="submit" className="btn btn-solid">
                                                <i className="fa fa-search" />{' '}
                                                {tr('search', 'بحث', 'Search')}
                                            </button>
                                        </div>
                                    </form>
                                </Col>
                            </Row>
                        </Container>
                    </section>

                    {/* ── Results area ── */}
                    <section className="section-b-space ratio_agilite">
                        <Container>

                            {/* Loading skeletons */}
                            {loading && (
                                <Row>
                                    {[1, 2, 3, 4].map((i) => (
                                        <Col key={i} xl="3" lg="4" md="6" xs="6">
                                            <PostLoader />
                                        </Col>
                                    ))}
                                </Row>
                            )}

                            {/* Error */}
                            {!loading && error && (
                                <Row>
                                    <Col className="text-center py-5">
                                        <i className="fa fa-exclamation-circle fa-3x text-danger mb-3" />
                                        <p className="text-danger">{error}</p>
                                    </Col>
                                </Row>
                            )}

                            {/* No results */}
                            {!loading && !error && searched && results.length === 0 && (
                                <Row>
                                    <Col className="text-center py-5">
                                        <img
                                            src="/assets/images/empty-search.jpg"
                                            className="img-fluid mb-4 mx-auto"
                                            alt=""
                                        />
                                        <h3>
                                            <strong>{tr('no_results_found', 'لا توجد نتائج', 'No results found')}</strong>
                                        </h3>
                                        <h4>
                                            {isRTL
                                                ? `لا توجد نتائج لـ "${searchParams.get('q')}" — حاول بكلمات مختلفة`
                                                : `No results for "${searchParams.get('q')}" — try different keywords`}
                                        </h4>
                                    </Col>
                                </Row>
                            )}

                            {/* Results grid */}
                            {!loading && !error && results.length > 0 && (
                                <>
                                    <Row className="mb-3">
                                        <Col>
                                            <h5 className="text-muted">
                                                {results.length}{' '}
                                                {tr('results_for', 'نتيجة لـ', 'result(s) for')}{' '}
                                                &ldquo;{searchParams.get('q')}&rdquo;
                                            </h5>
                                        </Col>
                                    </Row>

                                    <div className="product-wrapper-grid">
                                        <Row>
                                            {results.map((product) => (
                                                <Col key={productKey(product)} xl="3" lg="4" md="6" xs="6">
                                                    <ProductCardUnified
                                                        product={product}
                                                        isRTL={isRTL}
                                                        onQuickView={() => { }}
                                                        onAddToCart={(qty = 1) => addToCartBoth(product, qty)}
                                                        onAddToWishlist={() => wishlistContext?.addToWish?.(product)}
                                                        onAddToCompare={() => compareContext?.addToCompare?.(product)}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </>
                            )}

                            {/* Empty state — before first search */}
                            {!loading && !error && !searched && (
                                <Row>
                                    <Col className="text-center py-5">
                                        <i className="fa fa-search fa-3x text-muted mb-3" />
                                        <p className="text-muted">
                                            {tr('search_empty_state', 'ابحث عن منتج لتظهر النتائج هنا', 'Search for a product to show results here')}
                                        </p>
                                    </Col>
                                </Row>
                            )}

                        </Container>
                    </section>

                </Container>
            </section>
        </CommonLayout>
    );
};

export default Search;