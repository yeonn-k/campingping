'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import ModalBox from '@/components/ModalBox/ModalBox';
import WriteModal from './WriteModal';
import PostDetailModal from './PostDetailModal';
import write from '@icons/write.svg';
import search from '@icons/nav/search_gray.png';
import logo1 from '@images/campingping_orange.svg';

import { getPosts, getMyPosts, deletePost } from '@utils/communitiesService';
import { useLocationStore } from '@/stores/locationState';

import { api } from '@/utils/axios';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import { userStore } from '@/stores/userState';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface P {
  id: string;
  title: string;
  location: string;
  people: number;
  content: string;
  startDate: Date;
  endDate: Date;
}

interface Post {
  id: string;
  title: string;
  location: string;
  people: number;
  content: string;
  startDate: Date;
  endDate: Date;
  lat: number;
  lon: number;
  user: { nickname: string; email: string };
}

const limit = 10;
const CommunityPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [activeTab, setActiveTab] = useState<'myPosts' | 'allPosts'>(
    'allPosts'
  );
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const { userLat, userLon } = useLocationStore();
  const { userState } = userStore();
  const router = useRouter();

  useEffect(() => {
    if (userLat && userLon) {
      handleGetPosts();
    }
  }, []);

  const handleGetPosts = async () => {
    // if (activeTab === 'myPosts' && userState) {
    //   const data = await getMyPosts();
    //   if (data) {
    //     const postsWithDates = data.map((post: P) => ({
    //       ...post,
    //       startDate: new Date(post.startDate),
    //       endDate: new Date(post.endDate),
    //     }));
    //     setMyPosts(postsWithDates);
    //   }
    // }

    const data = await getPosts(userLat, userLon);

    if (data) {
      const postsWithDates = data.map((post: P) => ({
        ...post,
        startDate: new Date(post.startDate),
        endDate: new Date(post.endDate),
      }));
      setAllPosts(postsWithDates);
    }
  };

  const handleTabChange = async (tab: 'myPosts' | 'allPosts') => {
    setActiveTab(tab);

    if (tab === 'myPosts') {
      if (!userState) {
        router.push('/sign-in');
        toast.error('로그인이 필요한 페이지에요');
        return;
      }
      const data = await getMyPosts();
      if (data) {
        const postsWithDates = data.map((post: P) => ({
          ...post,
          startDate: new Date(post.startDate),
          endDate: new Date(post.endDate),
        }));
        setMyPosts(postsWithDates);
      }
    } else if (tab === 'allPosts') {
      const data = await getPosts(userLat, userLon);

      if (data) {
        const postsWithDates = data.map((post: P) => ({
          ...post,
          startDate: new Date(post.startDate),
          endDate: new Date(post.endDate),
        }));
        setAllPosts(postsWithDates);
      }
    }
  };

  const openWriteModal = () => setIsWriteModalOpen(true);
  const closeWriteModal = () => setIsWriteModalOpen(false);

  const openDetailModal = (post: Post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = async () => {
    setSelectedPost(null);
    setIsDetailModalOpen(false);

    const data = await getMyPosts();
    if (data) {
      const postsWithDates = data.map((post: P) => ({
        ...post,
        startDate: new Date(post.startDate),
        endDate: new Date(post.endDate),
      }));
      setMyPosts(postsWithDates);
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   const renderPosts = async () => {
  //     if (isDetailModalOpen === false) {
  //       const data = await getMyPosts();
  //       if (data) {
  //         const postsWithDates = data.map((post: P) => ({
  //           ...post,
  //           startDate: new Date(post.startDate),
  //           endDate: new Date(post.endDate),
  //         }));
  //         setMyPosts(postsWithDates);
  //       }
  //     }
  //   };
  //   renderPosts();
  // }, [isDetailModalOpen]);

  useEffect(() => {
    if (!selectedPost) {
      handleGetPosts();
    }
  }, [selectedPost]);

  // useEffect(() => {
  //   const fetchInitialPosts = async () => {
  //     const data = await getMyPosts();

  //     if (data) {
  //       const postsWithDates = data.map((post: P) => ({
  //         ...post,
  //         startDate: new Date(post.startDate),
  //         endDate: new Date(post.endDate),
  //       }));
  //       setMyPosts(postsWithDates);
  //     }
  //   };

  //   fetchInitialPosts();
  // }, []);
  const handleDeletePost = async (postId: string) => {
    if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        alert('게시글이 삭제되었습니다.');
        setMyPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
        getMyPosts();
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };
  const getallMyPosts = useCallback(async () => {
    if (isLoading) return;
    if (!userState) return;

    setIsLoading(true);
    try {
      const response = await api.get('/communities/myposts', {
        params: { limit, cursor: nextCursor },
      });
      const data = response.data.data.result;

      if (response.data.data.nextCursor === null) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setNextCursor(response.data.data.nextCursor);
      }

      setMyPosts((prev) => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [nextCursor, isLoading, hasMore]);

  const getallPosts = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await api.get('/communities', {
        params: { lat: userLat, lon: userLon, limit, cursor: nextCursor },
      });
      const data = response.data.data.result;

      if (response.data.data.nextCursor === null) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setNextCursor(response.data.data.nextCursor);
      }

      setMyPosts((prev) => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [nextCursor, isLoading, hasMore]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            getallMyPosts();
            getallPosts();
          }
        },
        { threshold: 0.4 }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, getMyPosts, getPosts]
  );

  return (
    <div
      className="min-h-screen bg-white overflow-y-scroll h-full w-full"
      ref={ref}
    >
      <div className="sticky top-0 bg-white shadow-md">
        <div className="flex justify-center mt-4 gap-1">
          <Image src={logo1} alt="로고 이미지" width={100} height={100} />
        </div>
        <div className="flex justify-center border-b border-gray-200">
          <button
            className={`flex-1 p-3 ${
              activeTab === 'myPosts'
                ? 'border-b-2 border-Green text-Green'
                : 'text-Gray'
            }`}
            onClick={() => handleTabChange('myPosts')}
          >
            내 게시물
          </button>
          <button
            className={`flex-1 p-3 ${
              activeTab === 'allPosts'
                ? 'border-b-2 border-Green text-Green'
                : 'text-Gray'
            }`}
            onClick={() => handleTabChange('allPosts')}
          >
            전체 게시물
          </button>
        </div>
      </div>

      <div className={`min-h-[calc(100vh-4rem)] `}>
        {activeTab === 'myPosts' ? (
          myPosts.length > 0 ? (
            <div className="flex flex-col space-y-4 mb-14">
              {myPosts.map((post, index) => (
                <div
                  key={index}
                  className="mt-6 ml-6 mr-6 mb-2 bg-white rounded-lg border border-Green cursor-pointer"
                  onClick={() => openDetailModal(post)}
                  ref={index === myPosts.length - 1 ? lastItemRef : null}
                >
                  <p className="ml-2 mt-2 flex justify-between">
                    제목 : {post.title}
                    <button
                      className="justify-end text-red-500 hover:text-red-700 whitespace-nowrap min-w-[50px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id!);
                      }}
                    >
                      삭제
                    </button>
                  </p>
                  <hr className="my-2 border-t-1 border-Green" />
                  <p className="ml-2 mt-1">
                    시작일 : {new Date(post.startDate).toLocaleDateString()}
                    부터
                  </p>
                  <p className="ml-2 mt-1">
                    종료일 : {new Date(post.endDate).toLocaleDateString()}
                    까지
                  </p>
                  <p className="ml-2 mt-1">장소 : {post.location}</p>
                  <p className="ml-2 mt-1">인원 : {post.people}</p>
                  <p className="ml-2 mt-1">기타 : {post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 text-Gray">
              <Image src={search} alt="검색 아이콘" width={40} height={40} />
              <p>작성된 게시물이 없습니다.</p>
            </div>
          )
        ) : activeTab === 'allPosts' ? (
          allPosts.length > 0 ? (
            <div className="flex flex-col space-y-4 mb-14">
              {allPosts.map((post, index) => (
                <div
                  key={index}
                  className="mt-6 ml-6 mr-6 mb-2 bg-white rounded-lg border border-Green cursor-pointer"
                  onClick={() => openDetailModal(post)}
                  ref={index === allPosts.length - 1 ? lastItemRef : null}
                >
                  <p className="ml-2 mt-2 flex justify-between">
                    제목 : {post.title}
                    <span className="mr-2 text-right">
                      작성자 : {post.user.nickname}
                    </span>
                  </p>
                  <hr className="my-2 border-t-1 border-Green" />
                  <p className="ml-2 mt-1">
                    시작일 : {new Date(post.startDate).toLocaleDateString()}
                    부터
                  </p>
                  <p className="ml-2 mt-1">
                    종료일 : {new Date(post.endDate).toLocaleDateString()}
                    까지
                  </p>
                  <p className="ml-2 mt-1">장소 : {post.location}</p>
                  <p className="ml-2 mt-1">인원 : {post.people}</p>
                  <p className="ml-2 mt-1">기타 : {post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 text-Gray">
              <Image src={search} alt="검색 아이콘" width={40} height={40} />
              <p>주변에 게시글을 작성한 사람이 없습니다.</p>
            </div>
          )
        ) : null}
      </div>
      <ScrollToTop scrollRef={ref} />

      <button
        className="fixed bottom-56 right-0 translate-x-[-14px] bg-white p-4 rounded-full shadow-shadowCustom w-14 h-14 z-[18]"
        onClick={openWriteModal}
      >
        <Image src={write} alt="게시글 작성" width={24} />
      </button>

      {isWriteModalOpen && (
        <ModalBox>
          <WriteModal onClose={closeWriteModal} onPostSubmit={handleGetPosts} />
        </ModalBox>
      )}
      {isDetailModalOpen && selectedPost && (
        <ModalBox>
          <PostDetailModal post={selectedPost} onClose={closeDetailModal} />
        </ModalBox>
      )}
    </div>
  );
};

export default CommunityPage;
