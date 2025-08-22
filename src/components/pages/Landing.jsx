import AboutMe from "../AboutMe";
import Footer from "../Footer";
import HeroSection from "../HeroSection";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate();
  return (
    <>
        <section
            className="relative h-screen  bg-auto bg-center  py-4 ">
            <Navbar/>
            <HeroSection/>
            <AboutMe/> 
            <Footer/>
            

        </section>       
      
    
    </>
  );
}

export default Landing;