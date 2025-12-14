import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EditableText } from "@/components/EditableText";

const Footer = () => {
  const [settings, setSettings] = useState({
    contactPhone: "9309496280",
    contactAddress: "Chinchwad, Pune",
    shopName: "SchoolShop",
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
            contactPhone: data.contact_phone,
            contactAddress: data.contact_address,
            shopName: data.shop_name,
          });
        }
      } catch (error) {
        console.log("Using default settings");
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#232f3e] text-white mt-12">
      {/* Back to Top */}
      <div 
        className="bg-[#37475a] hover:bg-[#485769] py-4 text-center cursor-pointer text-sm font-medium"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Get to Know Us */}
          <div>
            <h4 className="font-bold mb-4 text-base">Get to Know Us</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Press Releases</a></li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div>
            <h4 className="font-bold mb-4 text-base">Connect With Us</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
            </ul>
          </div>

          {/* Let Us Help You */}
          <div>
            <h4 className="font-bold mb-4 text-base">Let Us Help You</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Your Account</a></li>
              <li><a href="#" className="hover:underline">Returns Centre</a></li>
              <li><a href="#" className="hover:underline">Help</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-base">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📞 <EditableText field="contact_phone" defaultValue={settings.contactPhone} element="span" /></li>
              <li>📍 <EditableText field="contact_address" defaultValue={settings.contactAddress} element="span" /></li>
              <li>Maharashtra, India</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#131921] border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white">
                <EditableText field="shop_name" defaultValue={settings.shopName} element="span" />
              </span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">Conditions of Use</a>
              <a href="#" className="hover:underline">Privacy Notice</a>
              <a href="#" className="hover:underline">Help</a>
            </div>
            <div>
              © 2025 World of School Essentials
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
