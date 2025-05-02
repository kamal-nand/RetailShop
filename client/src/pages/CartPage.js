import { Button, Table, Form, Input, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

function CartPage() {
  const { cartItems } = useSelector(state => state.rootReducer);
  const [billChargeModal, setBillChargeModal] = useState(false);
  const [subtotal, setSubTotal] = useState(0);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const increaseQuantity = (record) => {
    dispatch({
      type: 'updateCart',
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const decreaseQuantity = (record) => {
    if (record.quantity > 1) {
      dispatch({
        type: 'updateCart',
        payload: { ...record, quantity: record.quantity - 1 },
      });
    } else {
      dispatch({
        type: 'deleteFromCart',
        payload: record,
      });
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <MinusCircleOutlined className='mx-3' onClick={() => decreaseQuantity(record)} />
          <b>{record.quantity}</b>
          <PlusCircleOutlined className='mx-3' onClick={() => increaseQuantity(record)} />
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'price',
      render: (price, record) => <span>₹ {price * record.quantity}</span>,
    },
    {
      title: 'Remove',
      dataIndex: '_id',
      render: (id, record) => (
        <DeleteOutlined onClick={() => dispatch({ type: 'deleteFromCart', payload: record })} />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity;
    });
    setSubTotal(temp);
  }, [cartItems]);

  const onFinish = async (values) => {
    const reqObject = {
      ...values,
      subtotal,
      cartItems,
      tax: Number(((subtotal / 100) * 10).toFixed(2)),
      totalAmount: Number(subtotal + 10),
      paymentMode: values.paymentMode, // Add this line
      userId: JSON.parse(localStorage.getItem('pos-user'))._id,
    };
    axios
      .post('/api/bills/charge-bill', reqObject)
      .then(() => {
        message.success('Bills Charged Successfully');
        dispatch({ type: 'emptyCart' });
        setBillChargeModal(false);
        navigate('/bills');
      })
      .catch(() => {
        message.error('Something went wrong');
      });
  };

  const totalAmount = subtotal + 10;
  const upiId = '6206561254@superyes'; // Replace with your UPI ID
  const qrValue = `upi://pay?pa=${upiId}&pn=Spencers&am=${totalAmount}&cu=INR`;

  return (
    <DefaultLayout>
      <h3>Cart</h3>
      <Table columns={columns} dataSource={cartItems} bordered pagination={false} />
      <hr />
      <div className='d-flex justify-content-end flex-column align-items-end'>
        <div className='subtotal'>
          <h3>
            SUB TOTAL : <b> ₹ {subtotal}/-</b>
          </h3>
        </div>
        <Button type='primary' onClick={() => setBillChargeModal(true)}>
          Place Order
        </Button>
      </div>

      <Modal title='Charge Bill' visible={billChargeModal} footer={false} onCancel={() => setBillChargeModal(false)}>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item name='customerName' label='Customer Name'>
            <Input />
          </Form.Item>
          <Form.Item name='customerPhoneNumber' label='Email'>
            <Input />
          </Form.Item>

          <Form.Item name='paymentMode' label='Payment Mode'>
            <Select onChange={(value) => setSelectedPaymentMode(value)}>
              <Select.Option value='cash'>Cash</Select.Option>
              <Select.Option value='qr'>UPI</Select.Option>
            </Select>
          </Form.Item>

          {selectedPaymentMode === 'qr' && (
            <div className='my-3 text-center'>
              <h4>Scan to Pay</h4>
              <QRCodeCanvas value={qrValue} size={180} />
              <p className='mt-2'><b>UPI ID:</b> {upiId}</p>
              <p><b>Amount:</b> ₹{totalAmount}</p>
            </div>
          )}

          <div className='charge-bill-amount'>
            <h5>
              SubTotal : ₹<b>{subtotal}</b>
            </h5>
            <h5>
              Handling Fee : ₹<b>10</b>
            </h5>
            <hr />
            <h2>
              Grand Total : ₹<b>{subtotal + 10}</b>
            </h2>
          </div>

          <div className='d-flex justify-content-end'>
            <Button type='primary' htmlType='submit'>
              GENERATE BILL
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
}

export default CartPage;