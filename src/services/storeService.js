import mockData from '@/datas/mockData/index';

// 모든 가게 목록 가져오기
const getAllStores = () => {
    try {
        return mockData.stores;
    } catch (error) {
        console.error('가게 목록 조회 오류:', error);
        return [];
    }
};

// 특정 가게 정보 가져오기
const getStoreById = (storeId) => {
    try {
        const store = mockData.stores.find(store => store.id === Number(storeId));
        return store || null;
    } catch (error) {
        console.error('가게 정보 조회 오류:', error);
        return null;
    }
};

// 가게 상세 정보 가져오기
const getStoreDetails = (storeId) => {
    try {
        return mockData.storeDetails[storeId] || null;
    } catch (error) {
        console.error('가게 상세정보 조회 오류:', error);
        return null;
    }
};

// 가게별 상품 목록 가져오기
const getStoreProducts = (storeId) => {
    try {
        return mockData.products[storeId] || [];
    } catch (error) {
        console.error('가게 상품 조회 오류:', error);
        return [];
    }
};
// 추가: 가게 공지사항 가져오기
// 가게 공지사항 가져오기 (만료일 체크 추가)
const getStoreNotices = (storeId) => {
    try {
        const notices = mockData.storeNotices?.[storeId] || [];

        // 현재 날짜
        const today = new Date();

        // 만료되지 않은 공지사항만 필터링하여 반환
        const validNotices = notices.filter(notice => {
            // expiredDate가 없으면 항상 표시
            if (!notice.expiredDate) return true;

            const expiredDate = new Date(notice.expiredDate);
            // 현재 날짜가 만료일 이전이면 표시
            return today <= expiredDate;
        });

        // 날짜 기준 내림차순 정렬 (최신순)
        return validNotices.sort((a, b) => new Date(b.date) - new Date(a.date));

    } catch (error) {
        console.error('가게 공지사항 조회 오류:', error);
        return [];
    }
};

const storeService = {
    getAllStores,
    getStoreById,
    getStoreDetails,
    getStoreProducts,
    getStoreNotices  // 추가
};

export default storeService;