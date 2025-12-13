import { ChevronRight, PenTool, Calculator, Palette, BookOpen, Ruler, Package } from "lucide-react";

const categories = [
  {
    name: "Writing Essentials",
    description: "Pens, pencils & markers",
    icon: PenTool,
    color: "bg-blue-100",
  },
  {
    name: "Mathematics Tools",
    description: "Geometry sets & calculators",
    icon: Calculator,
    color: "bg-green-100",
  },
  {
    name: "Art Supplies",
    description: "Colors, brushes & craft",
    icon: Palette,
    color: "bg-pink-100",
  },
  {
    name: "Notebooks",
    description: "All sizes & types",
    icon: BookOpen,
    color: "bg-yellow-100",
  },
  {
    name: "Geometry Sets",
    description: "Compasses & protractors",
    icon: Ruler,
    color: "bg-purple-100",
  },
  {
    name: "School Bags",
    description: "Backpacks & lunch boxes",
    icon: Package,
    color: "bg-orange-100",
  },
];

const Categories = () => {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <a href="/products" className="text-blue-600 hover:text-orange-600 flex items-center gap-1 text-sm font-medium">
            See all categories <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Categories Scroll */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <a
                  key={category.name}
                  href="#"
                  className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all w-64 flex-shrink-0 group"
                >
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1">
                    Shop now <ChevronRight className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
