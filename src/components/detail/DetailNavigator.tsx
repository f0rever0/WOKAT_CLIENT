import React, { useState, useEffect } from 'react';

function DetailNavigator() {
  const [navIndex, setNavIndex] = useState<number>(-1);
  const [navigator, setNavigator] = useState([
    { index: 0, name: '공간 소개', active: false },
    { index: 1, name: '운영 시간', active: false },
    { index: 2, name: '시설 정보', active: false },
    { index: 3, name: '공간 위치', active: false },
  ]);
  const [scrollY, setScrollY] = useState(0);

  const clickNavigator = (index: number) => {
    const newNavigator = navigator.map((item) => {
      if (item.index === index) {
        return {
          ...item,
          active: true,
        };
      } else {
        return {
          ...item,
          active: false,
        };
      }
    });

    setNavigator(newNavigator);
  };

  useEffect(() => {
    const activeTab = document.getElementById(`nav-${navIndex}`);
    activeTab?.scrollIntoView({ behavior: 'smooth' });
    clickNavigator(navIndex);
  }, [navIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(document.body.scrollTop);

      const newNavigator = navigator.map((item) => {
        const activeTab = document.getElementById(`nav-${item.index}`);
        const nextTab = document.getElementById(`nav-${item.index + 1}`);
        if (
          activeTab &&
          nextTab &&
          activeTab?.offsetTop - 70 < document.body.scrollTop &&
          document.body.scrollTop < nextTab?.offsetTop - 70
        ) {
          return {
            ...item,
            active: true,
          };
        } else {
          return {
            ...item,
            active: false,
          };
        }
      });

      setNavigator(newNavigator);
    };

    window.addEventListener('scroll', handleScroll, true);
    return window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <nav className="sticky top-0 -ml-4 flex h-[34px] w-screen flex-row items-center justify-between bg-WHTIE px-4">
        {navigator.map(({ index, name, active }) => {
          return (
            <article className=" flex flex-col items-center active:text-BLUE_600">
              <button
                key={index}
                onClick={() => setNavIndex(index)}
                type="button"
                className={`flex flex-col items-center font-system4_bold text-system4_bold ${
                  active ? 'text-BLUE_600' : 'text-GRAY_300 '
                }`}
              >
                <p className="flex h-[36px] flex-row items-center active:text-BLUE_600">
                  {name}
                </p>
                <p
                  className={` h-[3px] w-[84px]  rounded-full ${
                    active && 'bg-BLUE_600 '
                  }`}
                ></p>
              </button>
            </article>
          );
        })}
      </nav>
      <div className="-ml-4 mb-6  h-[2px] w-screen bg-GRAY_100"></div>
    </>
  );
}

export default DetailNavigator;
