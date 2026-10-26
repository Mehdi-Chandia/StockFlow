import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import type { IProduct } from "../types/product";
import { editProduct, getProduct, type IEditProduct } from "../services/productService";
import axios from "axios";

const EditProductPage = () => {
    const {productId}= useParams();
    const [loading, setLoading]=useState(false)
    const [error, setError]=useState("")
    const [product, setProduct]=useState<IProduct>();
    const [editProductData, setEditProductData]=useState<IEditProduct>({
        name: "",
        category:"",
        purchasePrice: 0,
        sellPrice: 0,
        minQty: 0,
        maxQty: 0,
        brand: "",
        description: ""
    })

    const fetchProduct=async ()=>{
        if (!productId) {
            setError("Product ID not found")
            return;
        }
        setLoading(true)
        try {
            const response= await getProduct(productId)
            console.log("product data ", response?.data);
            setProduct(response?.data)
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("error on product edit page ", error.response?.data);
                setError("Error while fetching product details");
            }
        }finally{
            setLoading(false)
        }
    }

    const handleEditProduct= async()=>{
        setLoading(true)
        try {
            const response= await editProduct(productId!, editProductData)
        } catch (error) {
          if (axios.isAxiosError(error)) {
                console.log("error on product edit page ", error.response?.data);
                setError("Error while updating product details");
            }  
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
       fetchProduct()
    }, [productId])

  return (
    <div>EditProductPage</div>
  )
}

export default EditProductPage;