"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiEdit, FiSave, FiX, FiCheck } from "react-icons/fi";
import TableHeaderWithHelp from "@/components/table/ProductTableHeader";
import productService from "@/services/productService";
import Pagination from "@/components/common/Pagination";
import ProductTableRow from "@/components/table/ProductTableRow";
import Toast from "@/components/common/Toast";

export default function ProductPage() {
    // #region const Definition
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState(""); //검색 기능
    const [selectedIds, setSelectedIds] = useState([]);// 선택된 상품 ID
    const [stockFilter, setStockFilter] = useState("all");// 필터
    const [sortBy, setSortBy] = useState("name");//정렬 기준
    const [currentPage, setCurrentPage] = useState(1);//페이지네이션
    const productsPerPage = 10; //페이지에 보여지는 상품 개수

    // 편집 모드 관리 상태
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    // 상품 데이터 불러오기
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                setError('상품 데이터를 불러오는 중 오류가 발생했습니다.');
                console.error('상품 데이터 로딩 오류:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    /// 필터링 로직
    const filteredProducts = products.filter(product => {
        // 검색어 필터링
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

        // 재고 필터링
        if (stockFilter === "out") return product.stock === 0 && matchesSearch;
        if (stockFilter === "low") return product.stock <= 10 && product.stock > 0 && matchesSearch;
        if (stockFilter === "normal") return product.stock > 10 && matchesSearch;
        return matchesSearch; // all
    });

    // 정렬 로직
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "stock") return a.stock - b.stock;
        if (sortBy === "date") return new Date(b.created) - new Date(a.created);
        return a.name.localeCompare(b.name); // name
    });
    // 테이블 항목별 도움말 텍스트
    const helpTexts = {
        name: "상품의 전체 이름입니다. 클릭하면 상세 페이지로 이동합니다.",
        category: "상품이 속한 카테고리입니다.",
        price: "상품의 판매 가격입니다. 부가세 포함 금액입니다.",
        stock: "현재 판매 가능한 재고 수량입니다. 10개 이하인 경우 노란색, 0개인 경우 빨간색으로 표시됩니다.",
        created: "상품이 처음 등록된 날짜입니다.",
        actions: "상품에 대한 관리 작업을 수행할 수 있습니다."
    };

    // 페이지네이션 로직
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // 페이지 변경 함수
    const goToPage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // 편집 모드 시작 함수
    const startEditing = (product) => {
        setEditingId(product.id);
        setEditData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category
        });
    };

    // 편집 취소 함수
    const cancelEditing = () => {
        setEditingId(null);
        setEditData({});
    };
    // 편집 내용 저장 함수
    const saveEditing = (id = editingId) => {
        try {
            // 실제로는 API 호출을 통해 서버에 저장
            setProducts(products.map(product =>
                product.id === id
                    ? { ...product, ...editData }
                    : product
            ));

            // 저장 성공 시 토스트 메시지 표시
            showToast(`'${editData.name}' 상품이 업데이트되었습니다.`, "success");

            // 편집 모드 종료
            setEditingId(null);
            setEditData({});
        } catch (error) {
            // 저장 실패 시 오류 메시지 표시
            showToast("상품 업데이트 중 오류가 발생했습니다.", "error");
        }
    };
    // 편집 중인 데이터 변경 핸들러
    const handleEditChange = (e, field) => {
        let value = e.target.value;

        // 숫자 필드의 경우 숫자로 변환
        if (field === 'price' || field === 'stock') {
            value = parseInt(value, 10) || 0;
        }

        setEditData({ ...editData, [field]: value });
    };
    // 전체 선택/해제 토글
    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            // 현재 페이지에 있는 모든 상품 ID 선택
            setSelectedIds(currentProducts.map(product => product.id));
        } else {
            // 모든 선택 해제
            setSelectedIds([]);
        }
    };

    // 개별 항목 선택/해제
    const toggleSelectItem = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };
    // 토스트 메시지 표시 함수
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });

        // 3초 후 토스트 메시지 자동 사라짐
        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
        }, 3000);
    };

    // 선택된 상품들 삭제
    const deleteSelectedProducts = async () => {
        if (selectedIds.length === 0) {
            showToast("삭제할 상품을 선택해주세요.", "info");
            return;
        }

        if (!window.confirm(`선택한 ${selectedIds.length}개의 상품을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            // 선택된 모든 상품 삭제 요청
            const deletePromises = selectedIds.map(id =>
                productService.deleteProduct(id)
            );

            await Promise.all(deletePromises);

            // 로컬 상태 업데이트
            setProducts(products.filter(product => !selectedIds.includes(product.id)));

            // 선택 목록 초기화
            setSelectedIds([]);

            // 성공 메시지 표시
            showToast(`${selectedIds.length}개의 상품이 삭제되었습니다.`, "success");
        } catch (err) {
            showToast("상품 삭제 중 오류가 발생했습니다.", "error");
            console.error('상품 일괄 삭제 오류:', err);
        }
    };

    // 로딩 중이면 로딩 표시
    if (loading) {
        return (
            <div className="p-4 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 오류가 있으면 오류 메시지 표시
    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                    <button
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => window.location.reload()}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }
    //#endregion

    //#region return value
    return (
        <div className="p-4">
            {/* 토스트 메시지 컴포넌트 */}
            <Toast {...toast} onClose={() => setToast({ show: false, message: "", type: "" })} />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">상품 조회 / 수정</h1>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                    <Link href="./add">
                        + 상품 추가
                    </Link>
                </button>
            </div>

            {/* 검색 및 필터 영역 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">검색</label>
                    <input
                        type="text"
                        placeholder="상품명 검색..."
                        className="w-full p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // 검색어 변경 시 첫 페이지로 이동
                        }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">재고 상태</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={stockFilter}
                        onChange={(e) => {
                            setStockFilter(e.target.value);
                            setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
                        }}
                    >
                        <option value="all">전체 상품</option>
                        <option value="out">품절</option>
                        <option value="low">품절 임박</option>
                        <option value="normal">정상 재고</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">정렬</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="name">상품명 순</option>
                        <option value="price-asc">가격 낮은 순</option>
                        <option value="price-desc">가격 높은 순</option>
                        <option value="stock">재고 적은 순</option>
                        <option value="date">최근 등록 순</option>
                    </select>
                </div>
            </div>

            {/* 데이터 테이블 */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3 text-left">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={currentProducts.length > 0 && selectedIds.length === currentProducts.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <TableHeaderWithHelp title="상품명" helpText={helpTexts.name} />
                            <TableHeaderWithHelp title="카테고리" helpText={helpTexts.category} />
                            <TableHeaderWithHelp title="가격" helpText={helpTexts.price} />
                            <TableHeaderWithHelp title="재고" helpText={helpTexts.stock} />
                            <TableHeaderWithHelp title="등록일" helpText={helpTexts.created} />
                            <TableHeaderWithHelp title="관리" helpText={helpTexts.actions} />
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map(product => (
                            <ProductTableRow
                                key={product.id}
                                product={product}
                                isSelected={selectedIds.includes(product.id)}
                                isEditing={editingId === product.id}
                                editData={editingId === product.id ? editData : {}}
                                onToggleSelect={toggleSelectItem}
                                onStartEditing={startEditing}
                                onCancelEditing={cancelEditing}
                                onSaveEditing={saveEditing}
                                onEditChange={handleEditChange}
                            />
                        ))}
                    </tbody>
                </table>

                {currentProducts.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                totalItems={sortedProducts.length}
                itemsPerPage={productsPerPage}
                startIndex={indexOfFirstProduct}
                endIndex={Math.min(indexOfLastProduct, sortedProducts.length)}
            />

            {/* 선택된 상품 일괄 작업 */}
            <div className="mt-4 p-3 bg-gray-100 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="text-sm font-medium">{selectedIds.length}개 선택됨</span>
                <div className="space-x-2">
                    <button
                        className={`px-3 py-1 border rounded ${selectedIds.length === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                        onClick={deleteSelectedProducts}
                        disabled={selectedIds.length === 0}
                    >
                        선택 삭제
                    </button>
                    <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50">상태 변경</button>
                    <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50">가격 일괄 변경</button>
                </div>
            </div>
        </div>
    );
}
//#endregion