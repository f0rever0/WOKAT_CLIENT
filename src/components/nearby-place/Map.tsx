import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import centerBtn from '@/assets/icons/center_button.svg';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    kakao: any;
  }
}

interface PlacePosition {
  x: string;
  y: string;
}

const dummy = [
  {
    place: '캐치카페 한양대',
    location: '서울 성동구 왕십리로 223 동우빌딩 2층 캐치카페 한양대',
  },
  {
    place: '스타벅스 한양대점',
    location: '서울 성동구 왕십리로 225',
  },
  {
    place: '덕수고등학교',
    location: '서울특별시 성동구 왕십리로 199',
  },
  {
    place: '정문약국',
    location: '서울특별시 성동구 왕십리로 236-1 1층 정문약국',
  },
];

interface MapProps {
  setStationName: Dispatch<SetStateAction<string>>;
}

function Map(props: MapProps) {
  const router = useRouter();
  const stationQuery = router.query.station as string[];

  const { setStationName } = props;
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [cmap, setMap]: any = useState();
  const [cposition, setPosition] = useState();
  let selectedMarker: any = null;
  let selectedCustomOverlay: any = null;

  const getOverlayContent = (placeName: string) => {
    const customOverlayContent = `
            <article  style="color : #576981;text-shadow: -0.5px 0 white, 0 0.5px white, 0.5px 0 white, 0 -0.5px white; font-family: 'Pretendard'; font-style: normal;
            font-weight: 600;
            font-size: 13px;
            line-height: 16px;
            text-align: center;"
            >${placeName}</article>`;
    return customOverlayContent;
  };

  //지도 로드하기
  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(mapScript);
    mapScript.addEventListener('load', () => setMapLoaded(true));
  }, []);

  //지도 로드 후 근처 지하철역 찾기
  useEffect(() => {
    if (!mapLoaded) return;

    window.kakao.maps.load(async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude; // 위도
          const lon = position.coords.longitude; // 경도
          const locPosition = new window.kakao.maps.LatLng(lat, lon);

          const mapContainer = document.getElementById('map');
          const mapOption = {
            center: locPosition, // 지도의 중심좌표
            level: 3, // 지도의 확대 레벨
          };
          const map = await new window.kakao.maps.Map(mapContainer, mapOption);
          setMap(map);

          if (stationQuery !== undefined && stationQuery[0] !== '') {
            const places = new window.kakao.maps.services.Places();
            const callback = (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                setPosition(
                  new window.kakao.maps.LatLng(result[0].y, result[0].x),
                );
                setStationName(result[0].place_name.split(' ')[0]);
              }
            };

            places.keywordSearch(stationQuery, callback);
            if (cmap) {
              cmap.setCenter(cposition);
            }
          } else {
            const places = new window.kakao.maps.services.Places();

            const callback = (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                setPosition(
                  new window.kakao.maps.LatLng(result[0].y, result[0].x),
                );
                setStationName(result[0].place_name.split(' ')[0]);
              }
            };
            const options = {
              location: locPosition,
              radius: 10000,
              sort: window.kakao.maps.services.SortBy.DISTANCE,
              size: 1,
            };

            await places.keywordSearch('지하철역', callback, options);
            if (cmap) {
              cmap.setCenter(cposition);
            }
          }
        });
      } else {
        alert('위치 정보를 받아오는데 실패했습니다');
      }
    });
  }, [mapLoaded]);

  //근처 지하철역으로 중심좌표 이동 및 마커 표시
  useEffect(() => {
    if (cmap) {
      cmap.setCenter(cposition);

      //위치마다 마커를 생성합니다
      for (let i = 0; i < dummy.length; i++) {
        const markerImageUrl =
          'https://wokat-default-image.s3.ap-northeast-2.amazonaws.com/default-mapMarker.png';
        const normalMarkerImage = new window.kakao.maps.MarkerImage(
          markerImageUrl,
          new window.kakao.maps.Size(37, 50),
        );
        const clickMarkerImage = new window.kakao.maps.MarkerImage(
          markerImageUrl,
          new window.kakao.maps.Size(47, 62),
        );
        const geocoder = new window.kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(
          dummy[i].location,
          (result: Array<PlacePosition>, status: string) => {
            // 정상적으로 검색이 완료됐으면
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(
                result[0].y,
                result[0].x,
              );

              const marker = new window.kakao.maps.Marker({
                map: cmap,
                position: coords,
                image: normalMarkerImage,
              });

              const customOverlayContent = getOverlayContent(dummy[i].place);
              const customOverlay = new window.kakao.maps.CustomOverlay({
                position: coords,
                content: customOverlayContent,
                yAnchor: -0.2,
              });

              customOverlay.setMap(cmap);

              window.kakao.maps.event.addListener(marker, 'click', () => {
                // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면
                // 마커의 이미지를 클릭 이미지로 변경합니다
                if (!selectedMarker || selectedMarker !== marker) {
                  // 클릭된 마커 객체가 null이 아니면
                  // 클릭된 마커의 이미지를 기본 이미지로 변경하고
                  // 커스텀 오버레이도 다시 회색으로 변경합니다
                  if (!!selectedMarker && !!selectedCustomOverlay) {
                    selectedMarker.setImage(normalMarkerImage);

                    const oriOverlayContent = getOverlayContent(
                      selectedCustomOverlay.a.innerText,
                    );

                    selectedCustomOverlay.a.innerHTML = oriOverlayContent;
                  }
                }

                marker.setImage(clickMarkerImage);

                const newOverlayContent = `
              <article style="color:#0066FF; text-shadow: -0.5px 0 white, 0 0.5px white, 0.5px 0 white, 0 -0.5px white; font-family: 'Pretendard';
              font-style: normal;
              font-weight: 700;
              font-size: 14px;
              line-height: 150%;
              text-align: center;
              letter-spacing: -0.02em;">${dummy[i].place}</article>`;

                customOverlay.a.innerHTML = newOverlayContent;
                // 클릭된 마커와 커스텀오버레이를 현재 클릭된 마커 객체/클릭된 오버레이 객체로 설정합니다
                selectedMarker = marker;
                selectedCustomOverlay = customOverlay;
              });
            }
          },
        );
      }
    }
  }, [cposition]);

  const onCenter = () => {
    if (cmap) {
      cmap.setCenter(cposition);
    }
  };

  return (
    <div className="relative -ml-4 -mr-4 h-[600px] w-screen overflow-hidden ">
      <div
        id="map"
        className="relative z-0 w-full h-full overflow-hidden "
      ></div>
      <div
        className="z-1 absolute left-[85%] top-[16px] flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-white drop-shadow-lg"
        onClick={() => onCenter()}
      >
        <Image priority={true} src={centerBtn} alt="center button" />
      </div>
    </div>
  );
}

export default Map;
