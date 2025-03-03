'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import userService from '@/services/userService';
import { AlertManager } from '@/libs/AlertManager';
import AddressInput from '@/components/common/AddressInput';
import { useRouter } from "next/navigation";


export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        zonecode: '',
        roadAddress: '',
        detailAddress: '',
        isBusinessOwner: false,
        businessInfo: {
            businessNumber: '',
            companyName: '',
            ceoName: '',
            businessType: '',
            businessCategory: '',
            businessAddress: '',
            businessZonecode: '',
            businessRoadAddress: '',
            businessDetailAddress: ''
        },
        marketingAgreed: false,
        joinDate: null
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = userService.getUserProfile();
                setUser(profile);
                setFormData({
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    location: profile.location,
                    zonecode: profile.zonecode,
                    roadAddress: profile.roadAddress,
                    detailAddress: profile.detailAddress,
                    isBusinessOwner: profile.isBusinessOwner || false,
                    businessInfo: profile.businessInfo || {
                        businessNumber: '',
                        companyName: '',
                        ceoName: '',
                        businessType: '',
                        businessCategory: '',
                        businessAddress: '',
                        businessZonecode: '',
                        businessRoadAddress: '',
                        businessDetailAddress: ''
                    },
                    marketingAgreed: profile.marketingAgreed || false,
                    joinDate: profile.joinDate
                });

                // Set initial profile image if exists
                if (profile.profileImage) {
                    setProfileImage(profile.profileImage);
                }

                setLoading(false);
            } catch (error) {
                console.error('프로필 정보 로드 실패:', error);
                AlertManager.error('프로필 정보를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // 체크박스 처리
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
            return;
        }

        // 사업자 정보 필드 처리
        if (name.startsWith('business_')) {
            const businessField = name.replace('business_', '');
            setFormData(prev => ({
                ...prev,
                businessInfo: {
                    ...prev.businessInfo,
                    [businessField]: value
                }
            }));
            return;
        }

        // 일반 필드 처리
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (addressData) => {
        setFormData(prev => ({
            ...prev,
            zonecode: addressData.zonecode,
            roadAddress: addressData.roadAddress,
            detailAddress: addressData.detailAddress
        }));
    };

    const handleBusinessAddressChange = (addressData) => {
        setFormData(prev => ({
            ...prev,
            businessInfo: {
                ...prev.businessInfo,
                businessZonecode: addressData.zonecode,
                businessRoadAddress: addressData.roadAddress,
                businessDetailAddress: addressData.detailAddress
            }
        }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 제한 (예: 5MB)
            if (file.size > 5 * 1024 * 1024) {
                AlertManager.error('프로필 이미지는 5MB 이하만 업로드 가능합니다.');
                return;
            }

            // 이미지 미리보기
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage({
                    file: file,
                    preview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSaveProfile = async () => {
        try {
            // 프로필 이미지 업로드 로직 (선택적)
            let profileImageUrl = null;
            if (profileImage && profileImage.file) {
                // 실제 구현에서는 userService.uploadProfileImage() 메서드 사용
                // profileImageUrl = await userService.uploadProfileImage(profileImage.file);
            }

            // 프로필 업데이트 데이터 준비
            const updateData = {
                ...formData,
                profileImage: profileImageUrl || profileImage
            };

            // 실제 구현에서는 userService.updateProfile() 메서드 사용
            // await userService.updateProfile(updateData);

            AlertManager.success('프로필이 성공적으로 업데이트되었습니다.');
            setEditMode(false);
        } catch (error) {
            console.error('프로필 업데이트 실패:', error);
            AlertManager.error('프로필 업데이트 중 오류가 발생했습니다.');
        }
    };

    const renderProfileImage = () => {
        return (
            <div className="relative">
                <div
                    className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center overflow-hidden relative group cursor-pointer"
                    onClick={editMode ? triggerFileInput : undefined}
                >
                    {profileImage ? (
                        <img
                            src={profileImage.preview || profileImage}
                            alt="프로필 이미지"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-4xl text-green-800 font-bold">
                            {user?.name?.charAt(0)}
                        </span>
                    )}
                    {editMode && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm">변경</span>
                        </div>
                    )}
                </div>
                {editMode && (
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfileImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                )}
            </div>
        );
    };

    const renderBusinessInfo = () => {
        if (!formData.isBusinessOwner) return null;

        return (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">사업자 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">사업자 번호</label>
                        <input
                            type="text"
                            name="business_businessNumber"
                            value={formData.businessInfo.businessNumber}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 disabled:bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">회사명</label>
                        <input
                            type="text"
                            name="business_companyName"
                            value={formData.businessInfo.companyName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 disabled:bg-gray-100"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">사업장 주소</label>
                    {editMode ? (
                        <AddressInput
                            zonecode={formData.businessInfo.businessZonecode}
                            roadAddress={formData.businessInfo.businessRoadAddress}
                            detailAddress={formData.businessInfo.businessDetailAddress}
                            onChange={handleBusinessAddressChange}
                        />
                    ) : (
                        <p className="mt-1 text-sm text-gray-600">
                            {formData.businessInfo.businessRoadAddress} {formData.businessInfo.businessDetailAddress}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                {/* 프로필 헤더 */}
                <div className="bg-green-50 p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        {renderProfileImage()}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                            <p className="text-sm text-gray-600">
                                가입일: {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        {editMode ? '취소' : '프로필 수정'}
                    </button>
                </div>

                {/* 프로필 정보 */}
                <div className="p-6">
                    {editMode ? (
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">연락처</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">위치</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">주소</label>
                                <AddressInput
                                    zonecode={formData.zonecode}
                                    roadAddress={formData.roadAddress}
                                    detailAddress={formData.detailAddress}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <div className="mt-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isBusinessOwner"
                                        checked={formData.isBusinessOwner}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-gray-700">사업자입니다</span>
                                </label>
                            </div>
                            {renderBusinessInfo()}
                            <div className="mt-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="marketingAgreed"
                                        checked={formData.marketingAgreed}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-gray-700">마케팅 정보 수신 동의</span>
                                </label>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    프로필 저장
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">이름</h3>
                                    <p className="text-gray-900">{user?.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">이메일</h3>
                                    <p className="text-gray-900">{user?.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">연락처</h3>
                                    <p className="text-gray-900">{user?.phone || '미등록'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">위치</h3>
                                    <p className="text-gray-900">{user?.location || '미등록'}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">주소</h3>
                                <p className="text-gray-900">
                                    {user?.roadAddress ? `${user.roadAddress} ${user.detailAddress || ''}` : '미등록'}
                                </p>
                            </div>
                            {user?.isBusinessOwner && (
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">사업자 정보</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">사업자 번호</h4>
                                            <p className="text-gray-900">{user?.businessInfo?.businessNumber || '미등록'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">회사명</h4>
                                            <p className="text-gray-900">{user?.businessInfo?.companyName || '미등록'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">사업장 주소</h4>
                                        <p className="text-gray-900">
                                            {user?.businessInfo?.businessRoadAddress ?
                                                `${user.businessInfo.businessRoadAddress} ${user.businessInfo.businessDetailAddress || ''}` :
                                                '미등록'
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-500">마케팅 정보 수신</h3>
                                <p className="text-gray-900">
                                    {user?.marketingAgreed ? '동의함' : '동의하지 않음'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 계정 활동 섹션 */}
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">내 활동</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <Link href="/user/orders" className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                            <svg className="mx-auto h-6 w-6 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                            <span className="text-sm text-gray-700">주문 내역</span>
                        </Link>
                        <Link href="/user/liked-stores" className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                            <svg className="mx-auto h-6 w-6 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            <span className="text-sm text-gray-700">찜한 가게</span>
                        </Link>
                        <Link href="/user/settings" className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                            <svg className="mx-auto h-6 w-6 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span className="text-sm text-gray-700">설정</span>
                        </Link>
                    </div>
                </div>

                {/* 추가 옵션 */}
                <div className="bg-white p-6 border-t border-gray-200 text-center">
                    <button
                        onClick={() => {
                            // 로그아웃 로직 추가 (userService.logout() 등)
                            AlertManager.success('로그아웃 되었습니다.');
                            // 로그인 페이지로 리다이렉트
                            router.push('/login');
                        }}
                        className="text-red-600 hover:text-red-700 transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}
