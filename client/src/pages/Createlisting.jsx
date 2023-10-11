import React,{useState} from "react";
import {app} from '../firebase'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
export default function Createlisting() {
    const [listingFile, setlistingFile] = useState([]);
    const [imageUploaderror, setimageUploaderror] = useState(false)
    const [formData, setformData] = useState({
        imageUrls:[],
    })
    console.log(formData);
    const handleImgaeSubmit=(e)=>{
        if(listingFile.length > 0 && listingFile.length + formData.imageUrls.length < 7){
            const promises = [];
            for(let i=0;i<listingFile.length;i++){
                promises.push(storeImage(listingFile[i]))
            }
            Promise.all(promises).then((urls)=>{
                // setformData({...formData,imageUrls:formData.imageUrls.concat(urls)})
                setformData({...formData,imageUrls:formData.imageUrls.concat(urls)});
                setimageUploaderror(false);
            }
            ).catch((error)=>{
                setimageUploaderror('Image uploaded failed (2mb max per image)');
            });
        }else{
            setimageUploaderror('You can upload 6 images per listing')
        }
    };
    const storeImage =async(file)=>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime()+file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    console.log(`Upload is ${progress}% done`)
                },
                (error)=>{
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL);
                    })
                }
            )
        })
    }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <div className="ontop">
        <div className="listingDiv text-center my-7">
          <h1 className="font-semibold text-3xl">Create Listing</h1>
        </div>
        <div className="listingForm">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
              <input
                type="text"
                name="name"
                id="name"
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
                placeholder="Enter description"
                className="border p-3 rounded-lg"
                maxLength="62"
                minLength="10"
                required
              />
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Enter address"
                className="border p-3 rounded-lg"
                required
              />
              <div className="checkboxdiv flex gap-6 flex-wrap">
                <div className="flex items-center gap-1">
                  <input type="checkbox" name="" id="sale" className="w-5" />
                  <span>Sale</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="checkbox" name="" id="rent" className="w-5" />
                  <span>Rent</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="checkbox" name="" id="parking" className="w-5" />
                  <span>Parking Spot</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name=""
                    id="furnished"
                    className="w-5"
                  />
                  <span>Furnished</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="checkbox" name="" id="offer" className="w-5" />
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
                  />
                  <p>Bath's</p>
                </div>
                <div className="childbesddiv flex items-center gap-2">
                  <input
                    type="number"
                    name="regularPrice"
                    id="regularPrice"
                    max="10"
                    min="1"
                    required
                    className="p-2 rounded-lg border"
                  />
                  <div className="subchildbesddiv flex flex-col items-center">
                    <p>Regular Price</p>
                    <span className="text-xs">($/Month)</span>
                  </div>
                </div>
                <div className="childbesddiv flex items-center gap-2">
                  <input
                    type="number"
                    name="discountPrice"
                    id="discountPrice"
                    max="10"
                    min="1"
                    required
                    className="p-2 rounded-lg border"
                  />
                  <div className="subchildbesddiv flex flex-col items-center">
                    <p>Discounted</p>
                    <span className="text-xs">($/Month)</span>
                  </div>
                </div>
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
                onChange={(e)=>setlistingFile(e.target.files)}
                  type="file"
                  name=""
                  id=""
                  accept="image/*"
                  multiple
                  className="p-3 rounded-lg w-full border"
                />
                <button type="button" onClick={handleImgaeSubmit} className="p-2 text-green-700 border-green-700 rounded-lg hover:shadow-lg disabled:opacity-80 uppercase bg-green-400">
                  Upload
                </button>
              </div>
            <p className="text-red-700 text-sm">{imageUploaderror && imageUploaderror}</p>
            {formData.imageUrls.length > 0 &&  formData.imageUrls.map((imageurl)=>(
                <img key={imageurl} src={imageurl} alt="listing image" className="imageRtyles h-40 object-cover rounded-lg"/>
            ))}
              <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                Create Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
