import { useState, useEffect } from "react";
import { adminService, Category, Product } from "@/services/admin.service";

export function useMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Buscar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminService.listCategories();
        setCategories(
          Array.isArray(response.data.categories)
            ? response.data.categories
            : []
        );
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Buscar produtos (por categoria se selecionada)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await adminService.listProducts(
          selectedCategory || undefined
        );
        setProducts(
          Array.isArray(response.data.products) ? response.data.products : []
        );
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  return {
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    loadingCategories,
    loadingProducts,
  };
}
