import React, { Ref, forwardRef } from 'react';
import placeLocation from '@/assets/icons/placeLocation.svg';
import DetailInformationTitle from '@/components/common/detail/DetailInformationTitle';

const PlaceLocation = forwardRef((props, ref) => {
  return (
    <section
      className="mb-9 scroll-mt-[50px]"
      ref={(reviewRef) => (ref.current[3] = reviewRef)}
    >
      <DetailInformationTitle icon={placeLocation} title="공간 위치" />
      <div className="mb-24 h-[300px] bg-BLUE_100">
        지도가 들어갈 부분입니다.
      </div>
      <div>아이폰 바</div>
    </section>
  );
});

export default PlaceLocation;
