import React, { useState } from "react";
import { app } from "../firebase";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";

export default function Createlisting() {
  const { currentUser } = useSelector((state) => state.user);
  const [listingFile, setlistingFile] = useState([]);
  const [imageUploaderror, setimageUploaderror] = useState(false);
  const [error, seterror] = useState(false);
  const [loading, setloading] = useState(false);
  const [uploading, setuploading] = useState(false);
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    disCountPrice: 0,
    offers: false,
    parking: false,
    furnished: false,
  });
  const handleChane = (event) => {
    if (event.target.id === "sale" || event.target.id === "rent") {
      setformData({ ...formData, type: event.target.id });
    }
    if (
      event.target.id === "parking" ||
      event.target.id === "furnished" ||
      event.target.id === "offers"
    ) {
      setformData({ ...formData, [event.target.id]: event.target.checked });
    }
    if (
      event.target.type === "number" ||
      event.target.type === "text" ||
      event.target.type === "textarea"
    ) {
      setformData({ ...formData, [event.target.id]: event.target.value });
    }
  };
  const handleImgaeSubmit = (e) => {
    if (
      listingFile.length > 0 &&
      listingFile.length + formData.imageUrls.length < 7
    ) {
      setuploading(true);
      setimageUploaderror(false);
      const promises = [];
      for (let i = 0; i < listingFile.length; i++) {
        promises.push(storeImage(listingFile[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          // setformData({...formData,imageUrls:formData.imageUrls.concat(urls)})
          setformData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setimageUploaderror(false);
          setuploading(false);
        })
        .catch((error) => {
          setimageUploaderror("Image uploaded failed (2mb max per image)");
          setuploading(false);
        });
    } else {
      setimageUploaderror("You can upload 6 images per listing");
      setuploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleDeleteImage = (index) => {
    setformData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleCreateListingSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      if (formData.imageUrls.length < 1) {
        return seterror("You must upload at least one image");
      }
      if (+formData.regularPrice < +formData.disCountPrice) {
        return seterror("Discount Price must be lower than Regular Price");
      }
      const requestData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        regularPrice: formData.regularPrice,
        discountPrice: formData.disCountPrice,
        bathRooms: formData.bathrooms,
        bedrooms: formData.bedrooms,
        furnished: formData.furnished,
        parking: formData.parking,
        type: formData.type,
        offer: formData.offers,
        imageUrls: formData.imageUrls,
        userRef: currentUser.rest._id,
      };
      setloading(true);
      seterror(false);
      const response = await axios.post("/api/listing/create", requestData);
      console.log(response);
      setloading(false);
      if (response.data.success === false) {
        seterror(response.data.message);
      }
      navigate(`/listing/${response.data.listing._id}`)
    } catch (error) {
      seterror(error);
      console.log(error);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <div className="ontop">
        <div className="listingDiv text-center my-7">
          <h1 className="font-semibold text-3xl">Create Listing</h1>
        </div>
        <div className="listingForm">
          <form
            onSubmit={handleCreateListingSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex flex-col gap-4 flex-1">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChane}
                placeholder="Enter name"
                className="border p-3 rounded-lg"
                maxLength="62"
                minLength="10"
                required
              />
              <input
                type="text"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChane}
                placeholder="Enter description"
                className="border p-3 rounded-lg"
                maxLength="62"
                minLength="10"
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChane}
                id="address"
                placeholder="Enter address"
                className="border p-3 rounded-lg"
                required
              />
              <div className="checkboxdiv flex gap-6 flex-wrap">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="sale"
                    id="sale"
                    className="w-5"
                    checked={formData.type === "sale"}
                    onChange={handleChane}
                  />
                  <span>Sale</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="rent"
                    id="rent"
                    className="w-5"
                    checked={formData.type === "rent"}
                    onChange={handleChane}
                  />
                  <span>Rent</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="parking"
                    id="parking"
                    className="w-5"
                    checked={formData.parking}
                    onChange={handleChane}
                  />
                  <span>Parking Spot</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="furnished"
                    id="furnished"
                    className="w-5"
                    checked={formData.furnished}
                    onChange={handleChane}
                  />
                  <span>Furnished</span>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="offers"
                    id="offers"
                    className="w-5"
                    checked={formData.offers}
                    onChange={handleChane}
                  />
                  <span>Offers</span>
                </div>
              </div>
              <div className="parentbesddiv flex items-center flex-wrap gap-6">
                <div className="childbesddiv flex items-center gap-2">
                  <input
                    type="number"
                    name="bedrooms"
                    id="bedrooms"
                    max="10"
                    min="1"
                    required
                    className="p-2 rounded-lg border"
                    value={formData.bedrooms}
                    onChange={handleChane}
                  />
                  <p>Beds</p>
                </div>
                <div className="childbesddiv flex items-center gap-2">
                  <input
                    type="number"
                    name="bathrooms"
                    id="bathrooms"
                    max="10"
                    min="1"
                    required
                    className="p-2 rounded-lg border"
                    value={formData.bathrooms}
                    onChange={handleChane}
                  />
                  <p>Bath's</p>
                </div>
                <div className="childbesddiv flex items-center gap-2">
                  <input
                    type="number"
                    name="regularPrice"
                    id="regularPrice"
                    max="100000"
                    min="50"
                    required
                    className="p-2 rounded-lg border"
                    value={formData.regularPrice}
                    onChange={handleChane}
                  />
                  <div className="subchildbesddiv flex flex-col items-center">
                    <p>Regular Price</p>
                    <span className="text-xs">($/Month)</span>
                  </div>
                </div>
                {formData.offers && (
                  <div className="childbesddiv flex items-center gap-2">
                    <input
                      type="number"
                      name="disCountPrice"
                      id="disCountPrice"
                      max="10000000"
                      min="0"
                      required
                      className="p-2 rounded-lg border"
                      value={formData.disCountPrice}
                      onChange={handleChane}
                    />
                    <div className="subchildbesddiv flex flex-col items-center">
                      <p>Discounted</p>
                      <span className="text-xs">($/Month)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <p className="font-semibold">
                Images:
                <span className="text-gray-700 ml-2 font-normal">
                  The first image will be the cover (max 6)
                </span>
              </p>
              <div className="flex items-center gap-4">
                <input
                  onChange={(e) => setlistingFile(e.target.files)}
                  type="file"
                  name=""
                  id=""
                  accept="image/*"
                  multiple
                  className="p-3 rounded-lg w-full border"
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleImgaeSubmit}
                  className="p-2 text-green-700 border-green-700 rounded-lg hover:shadow-lg disabled:opacity-80 uppercase bg-green-400"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
              <p className="text-red-700 text-sm">
                {imageUploaderror && imageUploaderror}
              </p>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((imageurl, index) => (
                  <div className="flex items-center gap-2 justify-between p-3 border">
                    <img
                      key={imageurl}
                      src={imageurl}
                      alt="listing image"
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="text-red-700 p-2 rounded-lg hover:opacity-95 uppercase"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                {loading ? "Creating..." : "Create Listing"}
              </button>
              {error && <p className="text-red-700 text-sm">{error.message}</p>}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
