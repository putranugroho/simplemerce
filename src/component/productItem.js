import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {connect} from 'react-redux'

class ProductItem extends Component {

    addToCart = () => {
        const idUsername = this.props.user.id
        const qty = parseInt(this.qty.value)
        var {id,nama,price,stock,src} = this.props.products
        
        if(qty !== 0 && idUsername !== ""){
            if (qty<stock) {
                axios.get(
                    'http://localhost:2019/cart',
                    {
                        params: {
                            idUser: idUsername,
                            idProduct: id
                        }
                    }
                ).then( res => {
                    if(res.data.length > 0){     
                        const totalQty = parseInt(res.data[0].qty) + parseInt(qty)  
                        axios.put('http://localhost:2019/cart/'+res.data[0].id,
                        {
                            idUser: idUsername,
                            idProduct: id,
                            nama: nama,
                            qty: totalQty,
                            price: price,
                            src: src
                        }).then(res=>{
                            alert('UPDATE: quantity product telah ditambahkan')
                        })
                    } else {
                        axios.post('http://localhost:2019/cart',
                        {
                            idUser: idUsername,
                            idProduct: id,
                            nama: nama,
                            qty: qty,
                            price: price,
                            src: src
                        }).then(res=>{
                            alert('NEW: product baru telah dimasukan kedalam cart')
                        })
                    }
                })    
            }
            alert('Jumlah barang yang dibeli melibihi stock')
        } else {
            if(idUsername === ""){
                alert('Silahkan login terlebih dahulu untuk melanjutkan transaksi')
            } else{
                alert('masukan jumlah barang yang ingin dibeli')
            }
            
        }

        return this.qty.value = 0
    }

    render () {
        var {id,nama,price,src,stock} = this.props.products
            return (
                <div className='card-body col-3 m-5'>
                    <img className='card-img-top' src={src}/>
                    <div className='card-body'>
                        <h5 className='card-title'>{nama}</h5>
                        <p className='card-text'>Rp. {price}</p>
                        <p className='card-text'>Stock Barang = {stock}</p>
                        <input className="form-control" ref={input => {this.qty = input}} type="text" defaultValue='0'/>
                        <Link to={'/detailproduct/' + id}>
                        <button className='btn btn-outline-primary btn-block'>Detail</button>
                        </Link>                   
                        <button className='btn btn-primary btn-block' onClick={()=>{this.addToCart(this.props.products)}}>Add To Cart</button>
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

export default connect(mapStateToProps)(ProductItem)