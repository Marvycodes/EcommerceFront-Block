"use client";
import styled from "styled-components";
import Center from "./Center";
import ButtonLink from "./ButtonLink";
import Button from "./Button";
import CartIcon from "./icons/CartIcons";

import { CartContext } from "./CartContext";
import { useContext, useState } from "react";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;
const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;
const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img {
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    div:nth-child(1) {
      order: 0;
    }
    img {
      max-width: 100%;
    }
  }
`;
const Column = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export default function Featured() {
  const { setCartProducts } = useContext(CartContext);

  async function addFeaturedToCart() {
    const response = await fetch(
      "http://localhost:5000/products/66cb1b18fdb73e262dfce33e"
    );
    const user = await response.json();
    console.log(user);

    setCartProducts((prev) => [...prev, user]);
    console.log(user.title);
  }
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>Macbook Pro</Title>
              <Desc>
                The MacBook Pro is a powerful, portable laptop with a stunning
                Retina display, fast processors, and advanced security features.
                It's designed for professionals and creatives who need a
                reliable and high-performance device on the go.
              </Desc>
              <ButtonsWrapper>
                <ButtonLink href={"/product/"} outline={1} white={1}>
                  Read more
                </ButtonLink>
                <Button white onClick={addFeaturedToCart}>
                  <CartIcon />
                  Add to cart
                </Button>
              </ButtonsWrapper>
            </div>
          </Column>
          <Column>
            <img
              src="https://dawid-next-ecommerce.s3.amazonaws.com/1679151719649.png"
              alt=""
            />
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
