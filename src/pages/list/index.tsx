import { useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/common/Layout';
import { useRouter } from 'next/router';
import profile from '@/assets/icons/profile.svg';
import list_profile from '@/assets/icons/list_profile.svg';
import list_location from '@/assets/icons/list_location.svg';
import bookmark from '@/assets/icons/bookmark.svg';
import testImage from '@/assets/images/main_background.svg';
import FAB from '@/components/list/FAB';
import ListFilter from '@/components/common/ListFilter';
import Navigation, { NavigationContext } from '@/components/common/Navigation';
import Link from 'next/link';
import ReservationForm from '@/components/list/ReservationForm';
import useNavigation from '@/hooks/useNavigation';

interface PlaceListType {
  imageUrl: string;
  title: string;
  distance: string;
  count: string;
  hashtags: string[];
}

const dummy = [
  {
    imageUrl: '',
    title: '홍대 유유기지',
    distance: '홍대입구역 5번 출구에서 도보 10분',
    count: '최대 10명',
    hashtags: ['해쉬태그', '해쉬태그', '해쉬태그'],
  },
  {
    imageUrl: '',
    title: '홍대 유유기지',
    distance: '홍대입구역 5번 출구에서 도보 10분',
    count: '최대 10명',
    hashtags: ['해쉬태그', '해쉬태그', '해쉬태그'],
  },
  {
    imageUrl: '',
    title: '홍대 유유기지',
    distance: '홍대입구역 5번 출구에서 도보 10분',
    count: '최대 10명',
    hashtags: ['해쉬태그', '해쉬태그', '해쉬태그'],
  },
  {
    imageUrl: '',
    title: '홍대 유유기지',
    distance: '홍대입구역 5번 출구에서 도보 10분',
    count: '최대 10명',
    hashtags: ['해쉬태그', '해쉬태그', '해쉬태그'],
  },
  {
    imageUrl: '',
    title: '홍대 유유기지',
    distance: '홍대입구역 5번 출구에서 도보 10분',
    count: '최대 10명',
    hashtags: ['해쉬태그', '해쉬태그', '해쉬태그'],
  },
];

function List() {
  const router = useRouter();
  const title = router.query.title as string;
  const [placeList, setPlaceList] = useState<PlaceListType[]>(dummy);
  const { navType, switchNavType } = useNavigation();

  return (
    <NavigationContext.Provider value={{ navType, switchNavType }}>
      <Layout title={`${title}역`} right={profile}>
        <FAB />
        <Navigation />
        <ListFilter />
        {navType === '무료 회의룸' && <ReservationForm />}
        {placeList.map(
          ({ imageUrl, title, distance, count, hashtags }, index) => (
            // TODO : index -> id로 변경
            <Link
              href={`detail/${index}`}
              key={index}
              className="h-30 mb-4 flex w-full border-b-2 border-GRAY_100 pb-4 scrollbar-hide"
            >
              <div className="relative">
                <Image
                  src={imageUrl || testImage}
                  alt="place image"
                  className="h-[120px] w-[100px] overflow-hidden rounded border border-black max-[360px]:h-[100px] max-[360px]:w-[80px]"
                />
                <Image
                  src={bookmark}
                  alt="bookmark button"
                  className="absolute bottom-2 right-2"
                />
              </div>
              <div className="ml-3 flex flex-col items-center justify-between">
                <div className="flex-col">
                  <h1 className="mb-2 font-system3_bold text-system3_bold text-GRAY_900 max-[360px]:text-system4">
                    {title}
                  </h1>
                  <div className="mb-1 flex">
                    <Image
                      src={list_location}
                      alt="location icon"
                      width={20}
                      height={20}
                    />
                    <p className=" font-system5 text-system5 text-GRAY_600 max-[360px]:text-system6">
                      {distance}
                    </p>
                  </div>
                  <div className="flex">
                    <Image
                      src={list_profile}
                      alt="profile icon"
                      width={20}
                      height={20}
                    />
                    <p className="font-system5 text-system5 text-GRAY_600 max-[360px]:text-system6">
                      {count}
                    </p>
                  </div>
                </div>
                <ul className="flex">
                  {hashtags.map((tag, index) => (
                    <li
                      key={index}
                      className="rounded-full bg-[#E0EDFFB2] px-2 py-0.5 font-system6 text-system6 text-BLUE_600 max-[360px]:px-1 "
                      style={{
                        marginRight: index === hashtags.length - 1 ? 0 : '8px',
                      }}
                    >
                      <span className="mr-[3px]">#</span>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ),
        )}
      </Layout>
    </NavigationContext.Provider>
  );
}

export default List;
