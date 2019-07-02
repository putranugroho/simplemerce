import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

class checkOut extends Component {

    state = {
        cart : [],
        product: [],
        selectedID: 0
    }

    componentDidMount(){
        this.getCart()
    }

    getProduct = () => {
        axios.get('http://localhost:2019/products')
            .then(res => {
               this.setState({product: res.data, selectedID : 0})
            })
    }

    getCart = () => {
        axios.get('http://localhost:2019/cart')
            .then(res => {
                this.setState({cart: res.data, selectedID: 0})
            })
    }

    totalQty = () => {
        // var cekQty = this.state.cart.map(item=>{
        //     return {
        //         qty: item.qty,
        //         idUser: item.idUser
        //     }  
        // })
        var totalQty = 0
        
        for (let i = 0; i < this.state.cart.length; i++) {
            if (this.props.user.id === this.state.cart[i].idUser) {    
                totalQty += parseInt(this.state.cart[i].qty);
            }  
        }
        return (
            <td>{totalQty}</td>
        )
    }

    totalHarga = () => {
        var cekHarga = this.state.cart.map(item=>{
            return {
                price: item.qty*item.price,
                idUser: item.idUser
            }
        })
        var subTotalHarga = 0

        for (let i = 0; i < this.state.cart.length; i++) {
            if (this.props.user.id === cekHarga[i].idUser) {
            subTotalHarga += parseInt(cekHarga[i].price);
            }
        }
        return (
            <td>{subTotalHarga}</td>
        )
    }

    saveProduct = (item) => {
        // item = iduser, idproduct, qty, price
        // const cekProduk = this.state.product.map((item)=>{
        //     return  {
        //         id: item.id,
        //         stock: item.stock
        //     }
        // })
        
        const qtyBaru = this.editQty.value

        // for (let i = 0; i < this.state.cart.length; i++) {
        //     if (item.id === cekProduk[i].id) {
        //         console.log('barang ada');
        //     } else {
        //         console.log('barang tidak ada');
        //     }
        // }
    

        axios.patch('http://localhost:2019/cart/'+item.id,
            {
                qty:qtyBaru
            }).then(res=>{
                this.getCart()
            })
        
    }

    deleteProduct = (item) => { 
        axios.delete('http://localhost:2019/cart/'+item.id).then(res=>{
            this.getCart()  
        })
    }

    renderList = () => {
    if(this.props.user.username !== ''){ // udah login apa blom   
        return this.state.cart.map( item => { // ngerender
            if(item.id !== this.state.selectedID){ 
                if(this.props.user.id === item.idUser){
                    return (
                        <tr>
                            <td>
                            <img className='list' src={item.src}/>
                            </td>
                            <td>{item.nama}</td>
                            <td>{item.price}</td>
                            <td>{item.qty}</td>
                            <td>{item.price*item.qty}</td>
                            <td>            
                                <button className = 'btn btn-danger m-1' onClick={()=>{this.setState({selectedID : item.id})}}>Edit</button>
                                <button className = 'btn btn-warning m-1' onClick={()=>{this.deleteProduct(item)}}>Delete</button>
                            </td>
                        </tr>
                    )
                }
            }else {
                if(this.props.user.id === item.idUser){
                    return (
                        <tr>
                            <td>
                            <img className='list' src={item.src}/>
                            </td>
                            <td>{item.nama}</td>
                            <td>{item.price}</td>
                            <td>
                            <input className="form-control" ref={input => {this.editQty = input}} type="text" defaultValue={item.qty}/>
                            </td>
                            <td>{item.price*item.qty}</td>
                            <td>            
                            <button className = 'btn btn-danger m-1' onClick={()=>{this.saveProduct(item)}}>Save</button>
                            <button className = 'btn btn-warning m-1' onClick={()=>{this.setState({selectedID : 0})}}>Cancel</button>
                            </td>
                        </tr>
                    )
                }
            }
        })
    }
    return <Redirect to='/login'/>
    }

    selesaiBelanja = () => {
        var stock = this.state.product.map(item=>{
            return {
                stock : item.stock,
                id : item.id
            }
        })

        var qty = this.state.cart.map(item=>{
            return {
                stock : item.qty,
                idProduct : item.idProduct,
                id: item.id
            }
        })

        
        
        for (let i = 0; i < this.state.product.length; i++) {
            for (let j = 0; j < this.state.cart.length; j++) {
                if (qty[i].idProduct === stock[j].id) {    
                    axios.patch('http://localhost:2019/products/'+stock[j].id,
                    {
                        stock : stock[j].stock-qty[i].qty
                    }).then(res=>{
                        axios.delete('http://localhost:2019/cart/'+qty[i].id).then( res =>{   
                        })
                    })
                }  
            }
        }
        alert('Terima Kasih telah berbelanja')
        return <Redirect to='/login'/>
    }

    render(){
        return(
            <div class="card row shopping-cart">
            <div className="container">
                <div class="card-header bg-dark text-light row">
                    <i class="fa fa-shopping-cart col-7" aria-hidden="true">Shipping Cart</i>
                    <a href="/" class="btn btn-outline-info btn-sm col-5">Continue Shopping</a>
                    <div class="clearfix"></div>
                </div>
                <table className="table table-hover mb-5">
                    <thead>
                        <tr>
                            <th scope="col">PRODUCT</th>
                            <th scope="col">NAME</th>
                            <th scope="col">PRICE</th>
                            <th scope="col">QTY</th>
                            <th scope="col">TOTAL</th>
                            <th scope="col">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderList()}
                        <tr>
                            <td></td>
                            <td></td>
                            <td><b>SUBTOTAL = </b></td>
                            {this.totalQty()}
                            {this.totalHarga()}
                            <td>
                            <button className = 'btn btn-primary m-1' onClick={()=>{this.selesaiBelanja()}}>Bayar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>    
            </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.auth // {id, username}
    }
}

export default connect(mapStateToProps)(checkOut)