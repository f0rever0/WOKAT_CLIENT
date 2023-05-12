import book from '@/assets/icons/book.svg';
import share from '@/assets/icons/share.svg';
import spot from '@/assets/icons/spot.svg';
import Image from 'next/image';

interface PlaceInfoProps {
  category: number;
  place: string;
  distance: string;
  hashtags: string[];
}

function PlaceInfo({ category, place, distance, hashtags }: PlaceInfoProps) {
  return (
    <>
      <section className="mb-2 mt-8 flex flex-row items-center justify-between">
        <p className="font-system6_medium text-system6_medium text-GRAY_400">
          {category === 1 ? '무료 회의룸' : '무료 대여 공간'}
        </p>
        <article className="flex flex-row items-center justify-center">
          <Image src={share} alt="share" className="mr-2.5 cursor-pointer" />
          <Image src={book} alt="book" className="cursor-pointer" />
        </article>
      </section>
      <h1 className="mb-2 font-system2_bold text-system2_bold text-GRAY_800">
        {place}
      </h1>
      <section className="mb-2 flex flex-row items-center">
        <Image src={spot} alt="spot" className="mr-2.5" />
        <p className="font-system5 text-system5 text-GRAY_600">{distance}</p>
      </section>
      <section className="mb-5 flex flex-row items-center">
        {hashtags.map((tag, index) => {
          return (
            <article
              key={index}
              className="mr-1.5 rounded-3xl bg-BLUE_100 pb-1 pl-2  pr-2 pt-1 font-system6 text-system6 text-BLUE_700"
            >
              {tag}
            </article>
          );
        })}
      </section>
    </>
  );
}

export default PlaceInfo;
