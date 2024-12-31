'use client'
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import styled from "styled-components";
import Title from "@/components/Title";


const ProductsGrid = styled.div`
display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;



export default async function NewProducts() {
  const response = await fetch("http://localhost:5000/products/");
  const users2 = await response.json();
  console.log(users2);
  return (
    <>
    <Header />
    <Center>
        <Title>All products</Title>
    <ProductsGrid >
        {users2.map(product => (<ProductBox key={product._id} {...product} />))}
    </ProductsGrid></Center>
    </>
  );
}
