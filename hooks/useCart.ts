import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OrderType = 'drive-thru' | 'delivery';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productDescription: string;
  productImage: string;
  basePrice: number;
  variantId?: string;
  variantName?: string;
  variantPriceAdjustment: number;
  quantity: number;
  finalPrice: number;
}

const CART_STORAGE_KEY = 'cartItems';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('drive-thru');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Ref para evitar salvamento durante carregamento inicial
  const isInitialLoad = useRef(true);

  // Carrega o carrinho do AsyncStorage apenas uma vez no mount
  useEffect(() => {
    console.log('[useCart] Iniciando carregamento...');
    let isMounted = true;

    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        console.log('[useCart] Dados carregados:', stored ? 'existe' : 'vazio');
        
        if (stored && isMounted) {
          const parsedItems = JSON.parse(stored);
          if (Array.isArray(parsedItems)) {
            console.log('[useCart] Items parseados:', parsedItems.length);
            setItems(parsedItems);
          }
        }
      } catch (err) {
        console.error('[useCart] Error loading cart:', err);
      } finally {
        if (isMounted) {
          console.log('[useCart] Carregamento concluído');
          setCartLoaded(true);
          isInitialLoad.current = false;
        }
      }
    };

    loadCart();

    return () => {
      console.log('[useCart] Cleanup');
      isMounted = false;
    };
  }, []);

  // Adiciona ou atualiza quantidade
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    console.log('[useCart] updateQuantity chamado:', itemId, quantity);
    
    setItems(prevItems => {
      let newItems: CartItem[];
      
      if (quantity <= 0) {
        newItems = prevItems.filter(item => item.id !== itemId);
      } else {
        newItems = prevItems.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        );
      }
      
      // Salva apenas se não for o carregamento inicial
      if (!isInitialLoad.current) {
        console.log('[useCart] Salvando após updateQuantity');
        AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems)).catch(err => {
          console.error('[useCart] Error saving cart:', err);
        });
      }
      
      return newItems;
    });
  }, []);

  // Remove item
  const removeItem = useCallback((itemId: string) => {
    console.log('[useCart] removeItem chamado:', itemId);
    
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      
      if (!isInitialLoad.current) {
        console.log('[useCart] Salvando após removeItem');
        AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems)).catch(err => {
          console.error('[useCart] Error saving cart:', err);
        });
      }
      
      return newItems;
    });
  }, []);

  // Limpar carrinho
  const clearCart = useCallback(() => {
    console.log('[useCart] clearCart chamado');
    setItems([]);
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify([])).catch(err => {
      console.error('[useCart] Error clearing cart:', err);
    });
  }, []);

  // Totais - memoizados com valores estáveis
  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
  }, [items]);

  const getTaxes = useCallback(() => 0, []);
  
  const getDiscount = useCallback(() => 0, []);
  
  const getTotal = useCallback(() => {
    return getSubtotal() + getTaxes() - getDiscount();
  }, [getSubtotal, getTaxes, getDiscount]);

  console.log('[useCart] Render - items:', items.length, 'loaded:', cartLoaded);

  return {
    items,
    cartLoaded,
    selectedOrderType,
    setSelectedOrderType,
    deliveryAddress,
    setDeliveryAddress,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTaxes,
    getDiscount,
    getTotal,
  };
}