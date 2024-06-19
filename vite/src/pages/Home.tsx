import { FC } from "react";
import { useOutletContext } from "react-router-dom";
import Slider from "react-slick";

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
const Home: FC = () => {
  const { provider } = useOutletContext<OutletContext>();

  return (
    <div className="">
      <h2> React Slick Slider Example </h2>
      <Slider fade={true} autoplay={true} autoplaySpeed={5000} arrows={false}>
        <div>
          <h3>Slide 1</h3>
        </div>
        <div>
          <h3>Slide 2</h3>
        </div>
        <div>
          <h3>Slide 3</h3>
        </div>
        <div>
          <h3>Slide 4</h3>
        </div>
        <div>
          <h3>Slide 5</h3>
        </div>
        <div>
          <h3>Slide 6</h3>
        </div>
      </Slider>
      zz
    </div>
  );
};

export default Home;
