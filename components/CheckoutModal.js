import React from 'react';
const CheckoutModal = props => {
    const divStyle = {
        display: props.displayModal ? 'block' : 'none'
    };
    function closeModal(e) {
        e.stopPropagation()
        props.closeModal()
    }
    return (
        <div
            className="modal"
            onClick={closeModal}
            style={divStyle} >
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()} >
                <span
                    className="close"
                    onClick={closeModal}>&times;
                </span>

                <div style={{
                    textAlign: "left",
                    fontSize: "20px"
                }}><span className='text-bold'>Total Amount</span> : 90000Rs</div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    props.onSubmitForm(e);
                }}>
                    <h5>Shipping Address</h5>
                    <input type="email" name="email" placeholder='Email' required/>
                    <input type="text" name="apartment" placeholder='Apartment/Landmark' required/>
                    <input type="text" name="street" placeholder='Street' required/>
                    <input type="text" name="city" placeholder='City' required/>
                    <input type="text" name="pincode" placeholder='Pincode' required/>
                    <input type="text" name="state" placeholder='State' required/>
                    <button className="btn waves-effect waves-light #1565c0 blue darken-3" type='submit'>Finish Order</button>
                    <p><sm>Only accepting cash on delivary</sm></p>
                </form>
            </div>
        </div>
    );
}
export default CheckoutModal;