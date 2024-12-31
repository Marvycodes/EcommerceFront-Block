"use client";
import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/input";
import Table from "@/components/Table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, setCartProducts } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  console.log(cartProducts);

  function moreOfThisProduct(product) {
    setCartProducts((prev) => [...prev, product]);
  }

  function lessOfThisProduct(product) {
    setCartProducts((prev) => {
      const pos = prev.indexOf(product);
      if (pos !== -1) {
        return prev.filter((value, index) => index !== pos);
      }
      return prev;
    });
  }

  let total = 0;
  for (const product of cartProducts) {
    const price = product.price || 0;
    total += price;
  }

  async function goToPayment() {
    await axios
      .post("http://localhost:5000/orders/create-checkout-session", {
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        cartProducts,
      })
      .then((response) => {
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Carts</h2>
            {!cartProducts?.length && <div>Your cart is empty</div>}
            {cartProducts?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Products</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((product) => {
                    return (
                      <tr key={product._id}>
                        <ProductInfoCell>
                          <ProductImageBox>
                            <img src={product.images} alt="" />
                          </ProductImageBox>{" "}
                          {product.title}
                        </ProductInfoCell>
                        <td>
                          <Button onClick={() => lessOfThisProduct(product)}>
                            -
                          </Button>
                          <QuantityLabel>
                            {
                              cartProducts.filter(
                                (obj) => obj._id === product._id
                              ).length
                            }
                          </QuantityLabel>{" "}
                          <Button onClick={() => moreOfThisProduct(product)}>
                            +
                          </Button>
                        </td>
                        <td>
                          {" "}
                          $
                          {cartProducts.filter((obj) => obj._id === product._id)
                            .length * product.price}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>${total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Order information</h2>

              <Input
                type="text"
                placeholder="Name"
                value={name}
                name="name"
                onChange={(ev) => setName(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Email"
                value={email}
                name="email"
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <CityHolder>
                <Input
                  type="text"
                  placeholder="City"
                  value={city}
                  name="city"
                  onChange={(ev) => setCity(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  name="postalCode"
                  onChange={(ev) => setPostalCode(ev.target.value)}
                />
              </CityHolder>

              <Input
                type="text"
                placeholder="Street Address"
                value={streetAddress}
                name="streetAddress"
                onChange={(ev) => setStreetAddress(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Country"
                value={country}
                name="country"
                onChange={(ev) => setCountry(ev.target.value)}
              />
              <input
                type="hidden"
                name="cartProducts"
                value={cartProducts.join(",")}
              />
              <Button block black onClick={goToPayment}>
                Continue to payment
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
