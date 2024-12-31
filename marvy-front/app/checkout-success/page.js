"use client"

import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

export default function checkoutSuccess(){
  const [isSuccess,setIsSuccess] = useState(false);
  const { cartProducts, setCartProducts } = useContext(CartContext);
  function clearCart() {
    setCartProducts([]);
  }
    
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('localhost5000:checkout-success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);
      return (
        <>
          <Header />
          <Center>
            <ColumnsWrapper>
              <Box>
                <h1>Thanks for your order!</h1>
                <p>We will email you when your order will be sent.</p>
              </Box>
            </ColumnsWrapper>
          </Center>
        </>
      );
      
    

}