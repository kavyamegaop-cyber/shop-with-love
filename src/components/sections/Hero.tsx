import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    heroTitle: "Everything for Student Success",
    heroSubtitle: "Premium school essentials with fast delivery to Chinchwad, Pune and nearby areas",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .single();
        
        if (data) {
          setSettings({
            heroTitle: data.hero_title,
            heroSubtitle: data.hero_subtitle,
          });
        }
      } catch (error) {
        console.log("Using default settings");
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Main Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg overflow-hidden shadow-lg mb-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="p-8 lg:p-12 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {settings.heroTitle}
              </h1>
              <p className="text-lg mb-6 text-blue-50">
                {settings.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate("/products")}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold px-8 py-6 text-lg rounded-md"
                >
                  Shop School Essentials
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="hidden lg:block relative h-[400px]">
              <img
                src={heroImage}
                alt="School essentials"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 text-center rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-3xl mb-2">✏️</div>
            <h3 className="font-semibold text-sm">Writing</h3>
            <p className="text-xs text-gray-600">Pens & Pencils</p>
          </div>
          <div className="bg-white p-6 text-center rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-3xl mb-2">📐</div>
            <h3 className="font-semibold text-sm">Mathematics</h3>
            <p className="text-xs text-gray-600">Geometry Sets</p>
          </div>
          <div className="bg-white p-6 text-center rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-3xl mb-2">🖍️</div>
            <h3 className="font-semibold text-sm">Art Supplies</h3>
            <p className="text-xs text-gray-600">Colors & Craft</p>
          </div>
          <div className="bg-white p-6 text-center rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold text-sm">Notebooks</h3>
            <p className="text-xs text-gray-600">All Sizes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
