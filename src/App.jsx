import Header from "./components/Header.jsx";
import Guitar from "./components/Guitar.jsx";
import { db } from "./data/db.js";
import { useState, useEffect } from "react";

function App() {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart)
    const MAX_QUANTITY = 5
    const MIN_QUANTITY = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item) {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_QUANTITY) {
                return;
            }
            const newCart = cart.map((guitar, index) =>
                index === itemExists ? { ...guitar, quantity: guitar.quantity + 1 } : guitar
            );
            setCart(newCart);
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    }

    function removeFromCart(guitar) {
        setCart(prevCart => prevCart.filter(item => item.id !== guitar.id));
    }

    function increaseQuantity(id) {

        setCart(prevCart => prevCart.map(item => item.id === id && item.quantity < MAX_QUANTITY ? { ...item, quantity: item.quantity + 1 } : item));
    }

    function reduceQuantity(id) {
        setCart(prevCart => prevCart.map(item => item.id === id && item.quantity > MIN_QUANTITY ? { ...item, quantity: item.quantity - 1 } : item));
    }

    function cleanCart() {
        setCart([]);
    }

    return (
        <>
            <Header
                cart={cart}
                removeFromCart={removeFromCart}
                increaseQuantity={increaseQuantity}
                reduceQuantity={reduceQuantity}
                cleanCart={cleanCart}
            />

            <main className="container-xl mt-5">
                <h2 className="text-center">Nuestra Colección</h2>

                <div className="row mt-5">
                    {data.map((guitar) => (
                        <Guitar
                            key={guitar.id}
                            guitar={guitar}
                            addToCart={addToCart}
                        />
                    ))}
                </div>
            </main>

            <footer className="bg-dark mt-5 py-5">
                <div className="container-xl">
                    <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
                </div>
            </footer>
        </>
    );
}

export default App;