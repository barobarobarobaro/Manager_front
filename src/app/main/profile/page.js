// app/profile/edit/page.js
"use client";
import { useState, useEffect } from "react";
import { FiUser, FiLock, FiMail, FiPhone, FiMapPin, FiSave, FiX, FiCamera, FiBriefcase, FiFileText, FiCreditCard, FiGlobe } from "react-icons/fi";
import userService from "@/services/userService";

export default function ProfileEditPage() {
    // 사용자 정보 상태
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        profileImage: null,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        // 판매자 정보 추가
        businessName: "",
        businessNumber: "",
        businessType: "",
        businessCategory: "",
        taxId: "",
        bankName: "",
        bankAccountNumber: "",
        bankAccountHolder: "",
        website: ""
    });

    // 수정 상태 관리
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [imagePreview, setImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState("personal"); // 'personal', 'business', 'account'
    const [isLoading, setIsLoading] = useState(true);

    // 페이지 로드 시 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await userService.getCurrentUser();
                const userData = response.data;

                setUser(prevUser => ({
                    ...prevUser,
                    ...userData,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }));

                if (userData.profileImage) {
                    setImagePreview(userData.profileImage);
                }
            } catch (error) {
                console.error("사용자 정보 로딩 오류:", error);
                setMessage({
                    type: "error",
                    text: "사용자 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    // 프로필 이미지 변경 핸들러
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // 이미지 유효성 검사
            if (!file.type.startsWith('image/')) {
                setMessage({ type: "error", text: "이미지 파일만 업로드 가능합니다." });
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB 제한
                setMessage({ type: "error", text: "이미지 크기는 5MB 이하만 가능합니다." });
                return;
            }

            try {
                setIsSubmitting(true);
                const response = await userService.uploadProfileImage(file);

                // 이미지 URL 업데이트
                setImagePreview(response.data.imageUrl);
                setUser(prevUser => ({
                    ...prevUser,
                    profileImage: response.data.imageUrl
                }));

                setMessage({ type: "success", text: "프로필 이미지가 업데이트되었습니다." });
            } catch (error) {
                console.error("이미지 업로드 오류:", error);
                setMessage({ type: "error", text: "이미지 업로드 중 오류가 발생했습니다." });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // 기본 정보 수정 제출 핸들러
    const handleSubmitInfo = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: "", text: "" });

        try {
            // 업데이트할 기본 정보 데이터 추출
            const personalData = {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            };

            await userService.updateUserProfile(personalData);
            setMessage({ type: "success", text: "기본 정보가 성공적으로 업데이트되었습니다." });
        } catch (error) {
            console.error("정보 업데이트 오류:", error);
            setMessage({ type: "error", text: "정보 업데이트 중 오류가 발생했습니다." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 사업자 정보 제출 핸들러
    const handleSubmitBusinessInfo = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: "", text: "" });

        try {
            // 업데이트할 사업자 정보 데이터 추출
            const businessData = {
                businessName: user.businessName,
                businessNumber: user.businessNumber,
                businessType: user.businessType,
                businessCategory: user.businessCategory,
                taxId: user.taxId,
                website: user.website
            };

            await userService.updateBusinessInfo(businessData);
            setMessage({ type: "success", text: "사업자 정보가 성공적으로 업데이트되었습니다." });
        } catch (error) {
            console.error("사업자 정보 업데이트 오류:", error);
            setMessage({ type: "error", text: "사업자 정보 업데이트 중 오류가 발생했습니다." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 계좌 정보 제출 핸들러
    const handleSubmitAccountInfo = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: "", text: "" });

        try {
            // 업데이트할 계좌 정보 데이터 추출
            const accountData = {
                bankName: user.bankName,
                bankAccountNumber: user.bankAccountNumber,
                bankAccountHolder: user.bankAccountHolder
            };

            await userService.updateBankAccount(accountData);
            setMessage({ type: "success", text: "계좌 정보가 성공적으로 업데이트되었습니다." });
        } catch (error) {
            console.error("계좌 정보 업데이트 오류:", error);
            setMessage({ type: "error", text: "계좌 정보 업데이트 중 오류가 발생했습니다." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 비밀번호 변경 제출 핸들러
    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        // 비밀번호 유효성 검사
        if (!user.currentPassword) {
            setMessage({ type: "error", text: "현재 비밀번호를 입력해주세요." });
            return;
        }

        if (!user.newPassword) {
            setMessage({ type: "error", text: "새 비밀번호를 입력해주세요." });
            return;
        }

        if (user.newPassword !== user.confirmPassword) {
            setMessage({ type: "error", text: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다." });
            return;
        }

        setIsSubmitting(true);
        setMessage({ type: "", text: "" });

        try {
            const passwordData = {
                currentPassword: user.currentPassword,
                newPassword: user.newPassword
            };

            await userService.changePassword(passwordData);

            // 성공 후 비밀번호 필드 초기화
            setUser({
                ...user,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            setMessage({ type: "success", text: "비밀번호가 성공적으로 변경되었습니다." });
        } catch (error) {
            console.error("비밀번호 변경 오류:", error);
            setMessage({ type: "error", text: "비밀번호 변경 중 오류가 발생했습니다." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 로딩 중 표시
    if (isLoading) {
        return (
            <div className="p-4 max-w-4xl mx-auto flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">판매자 프로필 수정</h1>

            {/* 알림 메시지 */}
            {message.text && (
                <div className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" :
                    message.type === "error" ? "bg-red-100 text-red-800" : ""
                    }`}>
                    {message.text}
                    <button
                        className="float-right"
                        onClick={() => setMessage({ type: "", text: "" })}
                    >
                        <FiX />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 좌측 프로필 이미지 및 탭 메뉴 */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="프로필 이미지"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <FiUser className="text-gray-400 text-4xl" />
                                        </div>
                                    )}
                                </div>
                                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                                    <FiCamera />
                                </label>
                                <input
                                    type="file"
                                    id="profile-image"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                            <div className="flex items-center mt-2">
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">판매자</span>
                            </div>
                        </div>
                    </div>

                    {/* 탭 메뉴 */}
                    <div className="bg-white rounded-lg shadow-md">
                        <ul>
                            <li>
                                <button
                                    className={`w-full text-left px-6 py-3 border-l-4 ${activeTab === 'personal' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent'}`}
                                    onClick={() => setActiveTab('personal')}
                                >
                                    <FiUser className="inline mr-2" /> 기본 정보
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`w-full text-left px-6 py-3 border-l-4 ${activeTab === 'business' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent'}`}
                                    onClick={() => setActiveTab('business')}
                                >
                                    <FiBriefcase className="inline mr-2" /> 사업자 정보
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`w-full text-left px-6 py-3 border-l-4 ${activeTab === 'account' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent'}`}
                                    onClick={() => setActiveTab('account')}
                                >
                                    <FiCreditCard className="inline mr-2" /> 계좌 정보
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`w-full text-left px-6 py-3 border-l-4 ${activeTab === 'password' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent'}`}
                                    onClick={() => setActiveTab('password')}
                                >
                                    <FiLock className="inline mr-2" /> 비밀번호 변경
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 우측 정보 수정 폼 */}
                <div className="md:col-span-2">
                    {/* 기본 정보 탭 */}
                    {activeTab === "personal" && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">기본 정보</h2>
                            <form onSubmit={handleSubmitInfo}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiUser />
                                        </span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={user.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="이름을 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiMail />
                                        </span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="이메일을 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiPhone />
                                        </span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={user.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="연락처를 입력하세요"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiMapPin />
                                        </span>
                                        <textarea
                                            name="address"
                                            value={user.address}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="주소를 입력하세요"
                                            rows="2"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                                        disabled={isSubmitting}
                                    >
                                        <FiSave className="mr-2" />
                                        {isSubmitting ? "저장 중..." : "저장하기"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* 사업자 정보 탭 */}
                    {activeTab === "business" && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">사업자 정보</h2>
                            <form onSubmit={handleSubmitBusinessInfo}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">상호명 (법인명)</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiBriefcase />
                                        </span>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={user.businessName}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="상호명을 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">사업자 등록번호</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiFileText />
                                        </span>
                                        <input
                                            type="text"
                                            name="businessNumber"
                                            value={user.businessNumber}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="사업자 등록번호를 입력하세요 (예: 123-45-67890)"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">사업자 유형</label>
                                        <select
                                            name="businessType"
                                            value={user.businessType}
                                            onChange={handleChange}
                                            className="w-full py-2 border rounded-md"
                                            required
                                        >
                                            <option value="">선택하세요</option>
                                            <option value="개인사업자">개인사업자</option>
                                            <option value="법인사업자">법인사업자</option>
                                            <option value="간이과세자">간이과세자</option>
                                            <option value="면세사업자">면세사업자</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">업종</label>
                                        <input
                                            type="text"
                                            name="businessCategory"
                                            value={user.businessCategory}
                                            onChange={handleChange}
                                            className="w-full py-2 border rounded-md"
                                            placeholder="업종을 입력하세요"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">종사업장번호</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiFileText />
                                        </span>
                                        <input
                                            type="text"
                                            name="taxId"
                                            value={user.taxId}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="종사업장번호가 있는 경우 입력하세요"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">종사업장이 없는 경우 빈칸으로 두세요.</p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">웹사이트</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiGlobe />
                                        </span>
                                        <input
                                            type="url"
                                            name="website"
                                            value={user.website}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="웹사이트 주소를 입력하세요"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                                        disabled={isSubmitting}
                                    >
                                        <FiSave className="mr-2" />
                                        {isSubmitting ? "저장 중..." : "저장하기"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* 계좌 정보 탭 */}
                    {activeTab === "account" && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">계좌 정보</h2>
                            <p className="text-sm text-gray-600 mb-4">판매 정산금을 받을 계좌 정보를 입력하세요.</p>

                            <form onSubmit={handleSubmitAccountInfo}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">은행명</label>
                                    <select
                                        name="bankName"
                                        value={user.bankName}
                                        onChange={handleChange}
                                        className="w-full py-2 border rounded-md"
                                        required
                                    >
                                        <option value="">은행을 선택하세요</option>
                                        <option value="국민은행">국민은행</option>
                                        <option value="신한은행">신한은행</option>
                                        <option value="우리은행">우리은행</option>
                                        <option value="하나은행">하나은행</option>
                                        <option value="농협은행">농협은행</option>
                                        <option value="기업은행">기업은행</option>
                                        <option value="SC제일은행">SC제일은행</option>
                                        <option value="카카오뱅크">카카오뱅크</option>
                                        <option value="토스뱅크">토스뱅크</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiCreditCard />
                                        </span>
                                        <input
                                            type="text"
                                            name="bankAccountNumber"
                                            value={user.bankAccountNumber}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="계좌번호를 입력하세요 ('-' 없이 숫자만 입력)"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">예금주명</label>
                                    <input
                                        type="text"
                                        name="bankAccountHolder"
                                        value={user.bankAccountHolder}
                                        onChange={handleChange}
                                        className="w-full py-2 border rounded-md"
                                        placeholder="예금주명을 입력하세요"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        예금주명은 사업자 등록증 상의 상호명과 일치해야 합니다.
                                    </p>
                                </div>

                                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-4">
                                    <p className="text-sm text-yellow-700">
                                        <strong>주의:</strong> 계좌 정보 변경 시 즉시 반영되며, 이후 정산은 변경된 계좌로 진행됩니다.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                                        disabled={isSubmitting}
                                    >
                                        <FiSave className="mr-2" />
                                        {isSubmitting ? "저장 중..." : "저장하기"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* 비밀번호 변경 탭 */}
                    {activeTab === "password" && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">비밀번호 변경</h2>
                            <form onSubmit={handleSubmitPassword}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiLock />
                                        </span>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={user.currentPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="현재 비밀번호를 입력하세요"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiLock />
                                        </span>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={user.newPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="새 비밀번호를 입력하세요"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        비밀번호는 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <FiLock />
                                        </span>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={user.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 py-2 border rounded-md"
                                            placeholder="새 비밀번호를 다시 입력하세요"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                                        disabled={isSubmitting}
                                    >
                                        <FiSave className="mr-2" />
                                        {isSubmitting ? "변경 중..." : "비밀번호 변경"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}