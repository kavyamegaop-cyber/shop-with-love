import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditableTextProps {
  value: string;
  field: "hero_title" | "hero_subtitle" | "shop_name" | "contact_phone" | "contact_address";
  className?: string;
  multiline?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export const EditableText = ({ 
  value, 
  field, 
  className = "", 
  multiline = false,
  as = "span"
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const { toast } = useToast();
  const Component = as;

  const handleDoubleClick = () => {
    const editMode = sessionStorage.getItem('editMode') === 'true';
    if (editMode) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ [field]: text, updated_at: new Date().toISOString() })
        .eq("id", 1);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Changes saved successfully",
      });
      setIsEditing(false);
      // Reload the page to show changes everywhere
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Save failed",
        description: "Could not save changes",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setText(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} border-2 border-blue-500 bg-white text-gray-900 p-2 rounded w-full`}
        autoFocus
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} border-2 border-blue-500 bg-white text-gray-900 p-1 rounded`}
        autoFocus
      />
    );
  }

  return (
    <Component
      className={`${className} ${sessionStorage.getItem('editMode') === 'true' ? 'cursor-pointer hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 transition-all' : ''}`}
      onDoubleClick={handleDoubleClick}
      title={sessionStorage.getItem('editMode') === 'true' ? "Double-click to edit" : ""}
    >
      {text}
    </Component>
  );
};
