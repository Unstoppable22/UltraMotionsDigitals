import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Faq() {
  const [openId, setOpenId] = useState(null);
    const navigate = useNavigate();

    
  const toggleAnswer = (id) => {
    setOpenId(openId === id ? null : id);
  }  
    
      const handleNavigation = () => {
        navigate('/category');
        
  };

  return (
    <>
    <div className="px-10 bg-[#e5f4fb]">
      <div className=" py-10">
      <h1 className="text-4xl text-left">Get Your Questions Clarified</h1>
      <h2>
        Find clear answers to all your queries about our innovative digital
        marketing services tailored for businesses in Lagos.
      </h2>
      </div>
      <div className=" mx-auto  space-y-10 bg-[#e5f4fb]">
      {/* Question 1 */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleAnswer(1)}
          className="text-xl font-semibold text-gray-800 w-full text-left focus:outline-none"
        >
          What services does ULTRA MOTIONS DIGITAL offer?
        </button>
        {openId === 1 && (
          <div className="mt-2 text-gray-600">
            We specialize in billboard and lamppost advertising, SEO campaigns and digital marketing, delivering strategies that amplify brand visibility and accelerate business growth in Nigeria.
          </div>
        )}
      </div>

      {/* Question 2 */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleAnswer(2)}
          className="text-xl font-semibold text-gray-800 w-full text-left focus:outline-none"
        >
          How can digital marketing benefit my business in Lagos?
        </button>
        {openId === 2 && (
          <div className="mt-2 text-gray-600">
            Digital marketing helps increase your online presence, drive
            traffic, and generate leads within your local market.
          </div>
        )}
      </div>

      {/* Question 3 */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleAnswer(3)}
          className="text-xl font-semibold text-gray-800 w-full text-left focus:outline-none"
        >
          Do you provide customized advertising strategies?
        </button>
        {openId === 3 && (
          <div className="mt-2 text-gray-600">
            Yes, we create personalized strategies based on your goals,
            audience, and budget.
          </div>
        )}
      </div>
      {/* Question 4 */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleAnswer(4)}
          className="text-xl font-semibold text-gray-800 w-full text-left focus:outline-none"
        >
          How experienced is ULTRA MOTIONS DIGITAL in digital marketing?
        </button>
        {openId === 4 && (
          <div className="mt-2 text-gray-600">
            Our team boasts extensive experience in digital marketing across
            various sectors, ensuring effective and innovative solutions.
          </div>
        )}
        </div>
      </div>
    </div>
    <div className=" bg-[#102116] backdrop-blur-xl py-10 flex justify-center px-10 ">
      <div className="text-center p-10 lg:py-10 lg:px-30 bg-[#4d605c] text-white rounded-lg ">
        <h1 className="text-[30px] lg:text-[35px] font-mono">Boost Your Brand Today</h1>
        <h2 className="text-[20px]">Unlock new levels of digital success with our cutting-edge marketing strategies and innovative advertising solutions tailored for your business needs in Lagos.</h2>
       <button onClick={handleNavigation} className='hover:bg-black/25 backdrop-blur-sm text-white text-xl drop-shadow-lg border border-white px-8 py-3 rounded-md mt-8 inline-block'>
  Get Started
</button>
      </div>
    </div>
    </>
  );
}
