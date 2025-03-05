import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "../components/ui-components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Plus, X, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { categories } from "../data/mockData";
import { productService } from "@/services/productService";
import { useAuth } from "@/contexts/AuthContext";

type ImageFile = {
  file: File;
  preview: string;
};

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "New",
    description: "",
  });
  
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast({
        title: "Maximum 5 images allowed",
        description: "Please remove some images before uploading more.",
        variant: "destructive",
      });
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    
    setImages([...images, ...newImages]);
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your product.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add products.",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
      };
      
      const imageFiles = images.map(img => img.file);
      
      await productService.createProduct(productData, imageFiles);
      
      toast({
        title: "Product added successfully!",
        description: "Your product has been listed on the marketplace.",
      });
      
      navigate("/products");
      
    } catch (error: any) {
      toast({
        title: "Error adding product",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <Link to="/seller-dashboard" className="mr-4">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold">Add New Product</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Provide detailed information about the item you're selling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="title">Product Title</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">
                            Be descriptive. Include key details like brand, model, color, etc.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., MacBook Pro 2022 M1 Pro 16GB RAM"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border border-input rounded-md p-2 h-10"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.filter(cat => cat.name !== "All").map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full border border-input rounded-md p-2 h-10"
                    required
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Service">Service (Non-physical item)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-input rounded-md p-3 text-sm"
                    placeholder="Describe your product in detail. Include features, specifications, reason for selling, etc."
                    required
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative h-24 rounded-md overflow-hidden border border-input">
                        <img
                          src={image.preview}
                          alt={`Upload preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-background/80 p-1 rounded-full"
                          onClick={() => removeImage(index)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 5 && (
                      <label className="flex flex-col items-center justify-center h-24 border border-dashed border-input rounded-md cursor-pointer hover:bg-secondary/50">
                        <Plus size={24} className="text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Add Image</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          multiple
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload up to 5 images. First image will be the cover image.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <>
                        Publishing...
                        <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                      </>
                    ) : (
                      <>
                        Publish Product
                        <Upload className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddProduct;
