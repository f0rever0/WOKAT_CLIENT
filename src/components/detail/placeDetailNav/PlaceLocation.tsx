import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Map from './Map';
import { ToastContext } from '@/context/ToastContext';
import placeLocation from '@/assets/icons/placeLocation.svg';
import DetailInformationTitle from '@/components/common/detail/DetailInformationTitle';
import change from '@/assets/icons/change.svg';
import locationPaste from '@/assets/icons/locationPaste.svg';
import { useGetPlaceAddress } from '@/hooks/queries/useDetail';
import { PlaceDetail } from '@/services/detail/types';

function PlaceLocation({
  placeName,
  location,
  category,
}: Pick<PlaceDetail, 'category' | 'location' | 'placeName'>) {
  const router = useRouter();
  const placeId = router.query.id as string;

  const [address, setAddress] = useState<string>(location);
  const [isRoadName, setIsRoadName] = useState<boolean>(false);
  const [addressHeight, setAddressHeight] = useState<number>(0);
  const { value } = useGetPlaceAddress({ placeId, isRoadName }, address);
  const { showToast } = useContext(ToastContext);

  const copyLocation = async () => {
    await navigator.clipboard.writeText(location);
    showToast('클립 보드에 복사되었습니다.');
  };

  const changeRoadName = () => {
    setIsRoadName(!isRoadName);
  };

  useEffect(() => {
    setAddress(value?.data);
    const height = document.getElementById('address')?.clientHeight;
    if (height) setAddressHeight(height);
  }, [value]);

  return (
    <section
      id="nav-3"
      className={`scroll-mt-[50px] ${
        category === '회의룸' ? 'pb-[135px]' : 'pb-[24px]'
      }`}
    >
      <DetailInformationTitle icon={placeLocation} title="공간 위치" />
      <div className="border-color-GRAY_100 rounded-[10px] 	border-[1px]">
        <Link
          href={{
            pathname: `/detail/${router.query.id}/location`,
            query: {
              place: placeName,
              location: location,
            },
          }}
        >
          <Map addressHeight={addressHeight} location={location} />
        </Link>
        <p
          id="address"
          className="mx-[14px] my-3 flex justify-start text-system5_medium font-system5_medium text-GRAY_800"
        >
          {address}
        </p>
        <div className="border-color-GRAY_100 mx-[3px] h-[1px] border-[1px]" />
        <section className="flex w-full flex-row justify-between">
          <article
            className="flex w-full cursor-pointer flex-row items-center justify-center"
            onClick={changeRoadName}
          >
            <Image
              src={change}
              alt="change icon"
              className="mr-2.5 cursor-pointer"
            />
            <p className="text-system5_medium font-system5_medium text-GRAY_900">
              지번
            </p>
          </article>
          <div className="border-color-GRAY_100 worigin-bottom-left mx-[3px] h-[42px] w-[1px] border-[1px]" />
          <article
            className="flex w-full cursor-pointer flex-row items-center justify-center"
            onClick={copyLocation}
          >
            <Image
              src={locationPaste}
              alt="locationPaste icon"
              className="mr-2.5 cursor-pointer"
            />
            <p className="text-system5_medium font-system5_medium text-GRAY_900">
              복사
            </p>
          </article>
        </section>
      </div>
    </section>
  );
}

export default PlaceLocation;
