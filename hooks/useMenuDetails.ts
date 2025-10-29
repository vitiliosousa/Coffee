import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { adminService, Product, Variant } from "@/services/admin.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useMenuDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const loadCartCount = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("cartItems");
      if (stored) {
        const items = JSON.parse(stored);
        const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartItemsCount(totalItems);
      }
    } catch (error) {
      console.error("Erro ao carregar contagem do carrinho:", error);
    }
  }, []);

  useEffect(() => {
    loadCartCount();
  }, [loadCartCount]);

  useEffect(() => {
    if (!id) return;

    const fetchProductAndVariants = async () => {
      setLoading(true);
      try {
        const productResponse = await adminService.getProductById(id as string);
        setProduct(productResponse.data.product);

        const variantsResponse = await adminService.listVariants(id as string);
        const variantsData = Array.isArray(variantsResponse.data.variants)
          ? variantsResponse.data.variants
          : [];
        setVariants(variantsData);

        if (variantsData.length > 0) {
          setSelectedVariantId(variantsData[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar produto ou variantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndVariants();
  }, [id]);

  const getSelectedVariant = () => variants.find((v) => v.id === selectedVariantId);

  const getFinalPrice = () => {
    if (!product) return 0;
    const variantPrice = getSelectedVariant()?.price_adjustment || 0;
    return (product.price as number) + variantPrice;
  };

  const handleAddToCart = async (onSuccess?: () => void, onError?: () => void) => {
    if (!product) return;

    const selectedVariant = getSelectedVariant();
    const finalPrice = getFinalPrice();

    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      productId: product.id,
      productName: product.name,
      productDescription: product.description || "Sem descrição",
      productImage: product.image_url || "https://via.placeholder.com/300",
      basePrice: product.price as number,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantPriceAdjustment: selectedVariant?.price_adjustment || 0,
      quantity,
      finalPrice,
    };

    try {
      const stored = await AsyncStorage.getItem("cartItems");
      let cartItems = stored ? JSON.parse(stored) : [];

      const existingItemIndex = cartItems.findIndex(
        (item: any) => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += newItem.quantity;
      } else {
        cartItems.push(newItem);
      }

      await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));

      const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartItemsCount(totalItems);

      setQuantity(1);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      onError?.();
    }
  };

  return {
    product,
    variants,
    selectedVariantId,
    setSelectedVariantId,
    quantity,
    setQuantity,
    loading,
    cartItemsCount,
    getSelectedVariant,
    getFinalPrice,
    handleAddToCart,
  };
}
