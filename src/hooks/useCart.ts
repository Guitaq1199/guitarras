import {useEffect, useMemo, useState} from "react";
import {db} from "../data/db.js";
import type { Guitar, CartItem } from "../types/index.js";

export const useCart = () => {

    const initialCart = () : CartItem[]=>{
        const localCart = localStorage.getItem("cart");
        return localCart ? JSON.parse(localCart) : [];
    }
    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);
    const MAX_ITEMS = 5;
    const MIN_ITEMS =1

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
    function addToCart(item : Guitar){
        const itemExists = cart.findIndex(guitar => guitar.id === item.id);
        if(itemExists >= 0) {
            if(cart[itemExists].quantity >= MAX_ITEMS)return
            const updatedCart = [...cart];
            updatedCart[itemExists].quantity++;
            setCart(updatedCart);
        }
        else {
            const newItem : CartItem = { ...item, quantity: 1 };
            setCart([...cart, newItem]);
        }
    }
    function removeFromCart(id : Guitar['id']){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    }
    function increaseQuantity(id : Guitar['id']){
        updateQuantity(id, 1);
    }

    function decreaseQuantity(id : Guitar['id']){
        updateQuantity(id, -1);
    }
    function updateQuantity(id: Guitar['id'], change : number){ {
        const updatedCart = cart.map(item => {

            if (item.id === id) {
                const newQuantity = item.quantity + change;

                if (newQuantity >= MIN_ITEMS && newQuantity <= MAX_ITEMS ) {
                    return {
                        ...item,
                        quantity: newQuantity
                    };
                }
            }

            return item;
        });

        setCart(updatedCart);
    }
    function clearCart(){
        setCart([])
    }
    const isEmpty = useMemo (() => cart.length ===0, [cart]);
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0),[cart]);

    return{
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal,
    }
 }
}
