import React,{ useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";



function Loader() {
  let [loading, setLoading] = useState(true);
  

  return (
   <div style={{marginTop:'150px'}}>
    <div className="sweet-loading text-center">
     

      <ClipLoader
        color="#000"
        loading={loading}
        cssOverride=''
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
    </div>
  );
}

export default Loader;