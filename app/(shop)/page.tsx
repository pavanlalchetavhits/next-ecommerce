import Hero from '@/components/Home/Hero';
import Categories from '@/components/Home/Categories';
import FeaturedProducts from '@/components/Home/FeaturedProduct';
import WhyChooseUs from '@/components/Home/WhyChooseUs';
import Testimonials from '@/components/Home/Testimonials';
import FlashSale from '@/components/Home/FlashSale';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      <FlashSale />
    </>
  );
}



