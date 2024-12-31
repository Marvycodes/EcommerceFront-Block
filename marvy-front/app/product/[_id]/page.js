"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import styled from "styled-components";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcons";
import { CartContext } from "@/components/CartContext";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

export default function ProductPage() {
  const searchparam = useSearchParams();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [formdata, setFormdata] = useState({
    title: " ",
    description: " ",
    price: " ",
    images: [],
  });
  console.log(formdata);

  useEffect(() => {
    axios
      .get("http://localhost:5000/products/" + id)
      .then((res) => {
        return setFormdata({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          images: res.data.images,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id]);

  const {setCartProducts} = useContext(CartContext);
  async function addFeaturedToCart() {
    const response =  await fetch("http://localhost:5000/products/" + id);
    const user = await response.json();
    console.log(user);
    
      
      setCartProducts((prev) => [...prev, user]);
    }
  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={formdata.images} />
          </WhiteBox>

          <div>
            <Title>{formdata.title}</Title>
            <p>{formdata.description}</p>
            <PriceRow>
              <div>
                <Price>${formdata.price}</Price>
              </div>
              <div>
                <Button primary onClick={() => addFeaturedToCart(formdata._id)}>
                  <CartIcon />Add to cart
                </Button>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
    </>
  );
}
