import styled from "styled-components";
import Button from "./Button";
import CartIcon from "./icons/CartIcons";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";
const ProductWrapper = styled.div``;
const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 100%;
    max-height: 80px;
  }
`;
const Title = styled(Link)`
  font-weight: normal;
  font-size: 0.9rem;
  color: inherit;
  text-decoration: none;
  margin: 0;
`;
const ProductInfoBox = styled.div`
  margin-top: 5px;
`;
const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;
const Price = styled.div`
  font-size: 1rem;
  font-weight: 400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight: 600;
    text-align: left;
  }
`;

export default function ProductBox({ _id, title, description, price, images }) {
  const { setCartProducts } = useContext(CartContext);

  async function addFeaturedToCart() {
    const response = await fetch("http://localhost:5000/products/" + _id);
    const user = await response.json();
    console.log(user);

    setCartProducts((prev) => [...prev, user]);
  }
  const url = "/product/" + _id;
  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <img src={images[0]} />
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title} </Title>
        <PriceRow>
          <Price>${price}</Price>

          <Button onClick={addFeaturedToCart} primary outline>
            Add to cart
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
