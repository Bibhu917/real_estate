import axios from "axios";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useParams } from "react-router-dom";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/listing/list/${params.id}`);
        console.log(response);
        if (response.data.success === false) {
          seterror(true);
          setLoading(false);
          return;
        }
        setListing(response.data.listing);
        setLoading(false);
        console.log(listing);
      } catch (error) {
        seterror(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);
  return (
    <main>
      {loading && <p className="text-center text-2xl my-7">Loading...</p>}
      {error && (
        <p className="text-center text-2xl my-7">Something went wrong !</p>
      )}
      {console.log(listing)}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing[0].imageUrls.map((url, index) => (
              <div>
                <SwiperSlide key={index}>
                  <div
                    className="h-[500px]"
                    style={{
                      background: `url(${url}) no-repeat`,
                      backgroundSize: "cover",
                      width:"100%",
                    }}
                  ></div>
                </SwiperSlide>
              </div>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
}
