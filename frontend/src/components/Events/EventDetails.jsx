import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Sepet from '../Sepet';
import { BiSolidHome } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { RiArrowRightSLine } from "react-icons/ri";
import { ImTicket } from "react-icons/im";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import Dropdown from 'react-bootstrap/Dropdown';
import { IoMdClose } from "react-icons/io";


function EventDetails() {

  const seatContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',

  };


  const seatStyle = {
    width: '35px',
    height: '35px',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '8px'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    marginTop: '50px',
    cursor: 'pointer',

  };
  const basketModalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: '1000',
  };

  const imageWrapperStyle = {
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
  };

  const imageStyle = {
    width: '25vw',
    height: '30vw',
    objectFit: 'cover',
    borderRadius: '10px',
    margin: 'auto'
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };



  const [event, setEvent] = useState(null);
  const { eventId } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);


  const toggleSeatSelection = (index) => {
    const updatedSeats = [...selectedSeats];
    updatedSeats[index] = !updatedSeats[index];
    setSelectedSeats(updatedSeats);
  };

  const addToBasket = () => {
    const selectedSeatDetails = event.seats.filter((_, index) => selectedSeats[index]);
    console.log('Selected Seats:', selectedSeatDetails);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8000/events/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          throw new Error('Error fetching event');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: 'slick-dots custom-dots-class'
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });


  const uniqueCategories = {};

  event.seats.forEach((seat) => {
    const category = seat.seatCategory.seatClass;
    const price = seat.seatCategory.seatPrice;

    if (!uniqueCategories[category]) {
      uniqueCategories[category] = price;
    }
  });

  return (
    <div className="">
      <Header />
      <div className='px-16 py-10 bg-gray-100'>
        <div>
          <div className='eventHeader bg-white rounded-full px-10 text-center flex flex-row pt-3 '>

            <Link to="/" className=' no-underline  hover:scale-105 '>
              <BiSolidHome className='text-2xl mr-1 text-rose-500 hover:text-rose-500' />
            </Link>
            <Link to="/categories/all" style={{ textDecoration: 'none' }}>
              <div className="flex items-center">
                <RiArrowRightSLine className='text-2xl text-indigo-500' />
                <p className='text-indigo-500 no-underline'>Etkinlik</p>
              </div>
            </Link>
            <RiArrowRightSLine className='text-2xl  text-indigo-500' />
            <p className='ml-2 text-rose-500 font-bold '>{event.name}</p>

          </div>

          <div className='p-5'>
            <Slider {...settings}>
              {event.eventImages.map((image, index) => (
                <div key={index} style={imageWrapperStyle}>
                  <img
                    style={imageStyle}
                    src={image.image}
                    alt=""
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div id='content' className='bg-white p-10 mx-20 rounded-2xl relative gap-3' style={{ boxShadow: '0 4px 8px #cbd5e1' }}>

            <div className='flex flex-row justify-between mb-4 px-10'>
              <h3 className='ml-2 text-indigo-400 font-bold'>
                {event.name}
              </h3>

              <div className='flex flex-row items-center '>
                <div className='flex flex-row mr-5'>
                  <FaMapMarkerAlt className='text-rose-500 mr-2 text-2xl' />
                  <span className='font-semibold text-slate-500 text-lg'>{event.location}</span>
                </div>
                <div className='flex flex-row '>
                  <ImTicket className='text-rose-500 mr-2 text-2xl' />
                  <span className='font-semibold text-slate-500 text-lg'>{event.category.title}</span>
                </div>
              </div>
            </div>

            <div className='bg-gray-100 px-4 rounded-2xl pt-4 pb-2 mx-12 ' style={{ boxShadow: '0 4px 8px #e0e7ff' }}>
              <p className=''><span className='font-semibold text-rose-900'>Etkinlik Detayı</span></p>
              <p className='text-gray-500 '> {event.description}</p>
            </div>

            {formattedDate < event.end_date ? (
              <div className="relative">
                <p><span className='font-semibold'>Gösteri devam ediyor mu?:</span> Evet</p>
                <div className="absolute top-0 -right-5 mt-2 mr-2 bg-purple-500 p-2 text-white font-bold rounded-md text-sm hover:scale-110 cursor-pointer hover:bg-indigo-500 transition-colors ease-in-out duration-500 animate-pulse origin-right rotate-12  ">
                  <i>Çabuk ol, biletler tükenmek üzere!</i>
                </div>
              </div>
            ) : (
              <div className="absolute top-0 -right-5 mt-2 mr-2 bg-red-500 p-2 text-white font-bold rounded-md text-sm hover:scale-110 cursor-pointer hover:bg-red-500 transition-colors ease-in-out duration-500 animate-pulse origin-right rotate-12">
                <i>Üzgünüz, bu etkinliğin tarihi geçti!</i>
              </div>
            )}

           

          </div>

          <div className='flex flex-row justify-between'>
            <div className='bg-white p-10 ml-20 my-10 w-auto rounded-2xl relative' style={{ boxShadow: '0 4px 8px #cbd5e1' }}>

              <div>
                <h3 className='text-indigo-500'>Etkinliğe Dair</h3>
              </div>
              <div className='border border-gray-100 my-4 px-8 py-3 rounded-2xl items-center' style={{ boxShadow: '0 4px 8px #cbd5e1' }}>

                <div className=' flex justify-center items-center'>
                  <p className='font-bold text-lg text-black'>{event.name}</p>
                </div>
                <div className="flex items-center ">
                  <MdDateRange className="text-rose-600 text-2xl" />
                  <span className="text-base text-gray-700 px-2">{formatDate(event.start_date)}</span>
                  <span>/</span>
                  <span className="text-base text-gray-700 px-2">{formatDate(event.end_date)}</span>
                </div>
                <div className='pt-3'>
                  <p className='text-gray-700'><span className='text-black font-semibold'>Konum:</span> {event.location}</p>
                </div>
              </div>

              <div >
                <div className='flex flex-row justify-center items-center  rounded-t-lg pt-3'>
                  <div className='flex flex-row'>
                    <FaMapMarkerAlt className='text-rose-500 mr-2 text-2xl' />
                    <p className='font-bold'>{event.owner}</p>

                  </div>
                </div>
                <iframe src={event.locationUrl} frameborder="0" style={{ width: "350px", height: "250px" }} className='rounded-2xl'></iframe>

              </div>
            </div>

            <div className='bg-white p-10 mx-20 my-10 w-auto rounded-2xl h-fit' style={{ boxShadow: '0 4px 8px #cbd5e1' }}>
              <div>
                <div className='flex flex-row items-center justify-center mb-5 text-blue-700 h-fit'>
                  <div className='pt-2'>
                    <h4>KOLTUK SEÇİNİZ</h4>

                  </div>
                  <div className='mx-20'>
                    <Dropdown>
                      <Dropdown.Toggle className='bg-white ring-1 ring-indigo-500 text-black w-40'>
                        Bilet Fiyatları
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ fontSize: "12px", boxShadow: '0 4px 8px #cbd5e1' }}>
                        {Object.entries(uniqueCategories).map(([category, price]) => (
                          <Dropdown.ItemText key={category} className='flex flex-col border-b border-gray-100'>
                            <span className='font-extrabold'>{price} TL<br /></span>
                            {category} Kategori
                          </Dropdown.ItemText>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                </div>

                <div style={seatContainerStyle}>
                  {event.seats.map((seat, index) => (
                    <div
                      key={index}
                      style={{
                        ...seatStyle,
                        backgroundColor: selectedSeats[index] ? '#10b981' : 'red',
                      }}
                      onClick={() => toggleSeatSelection(index)}
                      className='hover:scale-105'
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{seat.seatCategory.seatClass}{seat.seatNumber}</div>
                        {/* <div style={{}}>{seat.seatCategory.seatPrice} TL</div> */}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sepete ekle butonu */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => {
                      addToBasket();
                      setIsBasketOpen(true);
                    }}
                    style={buttonStyle}
                    className='hover:scale-105 rounded-full text-xl hover:ease-out transition duration-500'
                  >
                    Sepete Ekle
                  </button>
                </div>

                {/* Sepet modalı */}
                {isBasketOpen && (
                  <div className='rounded-2xl p-4' style={basketModalStyle}>
                    <Sepet selectedSeatDetails={event.seats.filter((_, index) => selectedSeats[index])} />
                    <div className='flex justify-between px-3 pt-3'>
                      <button className='hover:scale-105 text-red-500  flex flex-row items-center hover:text-red-600 hover:ease-out transition duration-500 absolute top-1 right-0' onClick={() => setIsBasketOpen(false)}><IoMdClose className='mr-1 text-2xl font-extrabold' /></button>
                      {/* <button onClick={handlePayment} className='bg-indigo-500 py-2 px-4 rounded-full text-white hover:scale-105 hover:ease-out transition duration-500'>
                      Ödeme Yap
                    </button> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EventDetails;
