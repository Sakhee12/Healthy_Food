import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="product/[id]" 
            options={{ 
              presentation: 'transparentModal',
              animation: 'fade',
              gestureEnabled: true,
            }} 
          />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="address_details" />
          <Stack.Screen name="payment" />
          <Stack.Screen 
            name="order-success" 
            options={{ 
              animation: 'slide_from_bottom',
            }} 
          />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}