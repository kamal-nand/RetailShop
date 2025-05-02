import React , {useEffect, useState}from 'react'
import DefaultLayout from '../components/DefaultLayout'
import axios from 'axios'
import { Col, Row } from 'antd';
import Item from '../components/Item';
import '../resources/items.css'
import { useDispatch } from 'react-redux';
function Homepage() {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory]=useState('fruits')
  const categories = [
    {
      name : 'Fruits',
      imageURL : 'https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-3foodgroups_fruits_detailfeature.jpg?sfvrsn=64942d53_4',
    },
    {
      name : 'Vegetables',
      imageURL : 'https://cdn.britannica.com/17/196817-050-6A15DAC3/vegetables.jpg',
    },
    {
      name : 'Meat',
      imageURL : 'https://images.ctfassets.net/3s5io6mnxfqz/5GlOYuzg0nApcehTPlbJMy/140abddf0f3f93fa16568f4d035cd5e6/AdobeStock_175165460.jpeg',
    },
    {
      name : 'Dairy',
      imageURL : 'https://www.shutterstock.com/image-photo/new-delhi-india-may-2022-600nw-2163953449.jpg',
    },
    {
      name : 'Snacks',
      imageURL : 'https://m.media-amazon.com/images/I/81ZX-dvnU1L.jpg',
    },
    {
      name : 'Drinks',
      imageURL : 'https://5.imimg.com/data5/TO/XJ/QN/ANDROID-80650971/product-jpeg-500x500.jpg',
    },
    {
      name : 'Health & Wellness',
      imageURL : 'https://ik.imagekit.io/wlfr/wellness/images/category/l1/sexual-wellness/Hero-0.png/tr:w-3840,c-at_max,cm-pad_resize,f-auto,q-70',
    }
  ]
  const dispatch = useDispatch()
  const getAllItems=()=>{
    dispatch({type:'showLoading'})
    axios.get('/api/items/get-all-items').then((response)=>{
      dispatch({type:'hideLoading'})
      setItemsData(response.data);
    }).catch((error)=>{
      dispatch({type:'showLoading'})  
      console.log(error)
    });
  };

  useEffect(() => {
     getAllItems();
  }, []);
  

  return (
    <DefaultLayout>
     
      <div className='d-flex categories'>
           {categories.map((category)=>{
             return <div 
            onClick={()=>setSelectedCategory(category.name)}
            className={`d-flex category ${selectedCategory===category.name && 'selected-category'}`}>
                 <h4>{category.name}</h4>
                 <img src={category.imageURL} height='60' alt="" width='80'/>
              </div>
           })}
      </div>
      
      <Row gutter={20}>
        
        {itemsData.filter((i)=>i.category===selectedCategory).map((item)=>{
        return  <Col xs ={24} lg ={6} md={12} sm={8}>
          <Item item={item}/>
        </Col>

      })}</Row>
     
    </DefaultLayout>
  );
}

export default Homepage;