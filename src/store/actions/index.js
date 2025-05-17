import api from "../../api/api"

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
         });
    }
};


export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_ERROR" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
         });
    }
};


export const addToCart = (data, qty = 1, toast) => 
    async (dispatch, getState) => {
        try {
            const { data: cartResponse } = await api.post(`/carts/products/${data.productId}/quantity/${qty}`);
            dispatch({ type: "GET_USER_CART_PRODUCTS", payload: cartResponse.products, totalPrice: cartResponse.totalPrice, cartId: cartResponse.cartId });
            localStorage.setItem("cartItems", JSON.stringify(cartResponse.products));
            toast.success(`${data?.productName} added to the cart`);
        } catch (error) {
            toast.error("Failed to add product to cart");
        }
    };


export const increaseCartQuantity = (data, toast) => async (dispatch, getState) => {
    try {
        const { data: cartResponse } = await api.put(`/cart/products/${data.productId}/quantity/increase`);
        dispatch({ type: "GET_USER_CART_PRODUCTS", payload: cartResponse.products, totalPrice: cartResponse.totalPrice, cartId: cartResponse.cartId });
        localStorage.setItem("cartItems", JSON.stringify(cartResponse.products));
    } catch {
        toast.error("Quantity Reached to Limit");
    }
};


export const decreaseCartQuantity = (data, toast) => async (dispatch, getState) => {
    try {
        const { data: cartResponse } = await api.put(`/cart/products/${data.productId}/quantity/delete`);
        dispatch({ type: "GET_USER_CART_PRODUCTS", payload: cartResponse.products, totalPrice: cartResponse.totalPrice, cartId: cartResponse.cartId });
        localStorage.setItem("cartItems", JSON.stringify(cartResponse.products));
    } catch {
        toast.error("Failed to update quantity");
    }
};


export const removeFromCart = (data, toast) => async (dispatch, getState) => {
    try {
        const cartId = getState().carts.cartId;
        await api.delete(`/carts/${cartId}/product/${data.productId}`);
        // Pobierz aktualny koszyk z backendu
        const { data: cartResponse } = await api.get(`/carts/users/cart`);
        dispatch({ type: "GET_USER_CART_PRODUCTS", payload: cartResponse.products, totalPrice: cartResponse.totalPrice, cartId: cartResponse.cartId });
        localStorage.setItem("cartItems", JSON.stringify(cartResponse.products));
        toast.success(`${data.productName} removed from cart`);
    } catch {
        toast.error("Failed to remove product from cart");
    }
};

export const fetchUserCart = () => async (dispatch) => {
    try {
        const { data } = await api.get("/carts/users/cart");
        dispatch({ type: "GET_USER_CART_PRODUCTS", payload: data.products, totalPrice: data.totalPrice, cartId: data.cartId });
        localStorage.setItem("cartItems", JSON.stringify(data.products));
    } catch (error) {
        
    }
};

export const authenticateSignInUser 
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signin", sendData);
            dispatch({ type: "LOGIN_USER", payload: data });
            localStorage.setItem("auth", JSON.stringify(data));
            reset();
            toast.success("Login Success");
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Internal Server Error");
        } finally {
            setLoader(false);
        }
}

export const registerNewUser 
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signup", sendData);
            reset();
            toast.success(data?.message || "User Registered Successfully");
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};


export const logOutUser = (navigate) => (dispatch) => {
    dispatch({ type:"LOG_OUT" });
    localStorage.removeItem("auth");
    navigate("/login");
};
