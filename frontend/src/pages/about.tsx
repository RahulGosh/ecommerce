import Title from "../components/title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/newsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et at
            quaerat consectetur, unde reiciendis officiis?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia quas
            facilis ipsa perferendis eius veniam maxime cumque odit fugit
            ratione quidem ea error voluptatum necessitatibus nihil, nesciunt
            ullam culpa aliquid.
          </p>
          <p className="text-gray-800">Our Mission</p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam,
            amet odio? Magni voluptates facilis nihil.
          </p>
        </div>
      </div>

      <div className="text-4xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis nam,
            aspernatur nesciunt minus ipsa facilis voluptates.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convinience:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis nam,
            aspernatur nesciunt minus ipsa facilis voluptates.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis nam,
            aspernatur nesciunt minus ipsa facilis voluptates.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
