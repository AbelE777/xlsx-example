import "./App.css";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [xlsx, setXlsx] = useState([]);
  /* set up XMLHttpRequest */
  const getXlsx = async () => {
    let url =
      "https://res.cloudinary.com/de0ncdhdk/raw/upload/v1649694314/Inventario_de_bienes_inmuebles_feb._2022_viapke.xlsx";

    const config = {
      url,
      responseType: "blob",
      headers: {
        "Content-Type": "blob",
      },
    }
    
    let { data } = await axios.get(config);
    console.log(data);
  };

  useEffect(() => {
    let url =
      "https://res.cloudinary.com/de0ncdhdk/raw/upload/v1649694314/Inventario_de_bienes_inmuebles_feb._2022_viapke.xlsx";
    let oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = (e) => {
      let arraybuffer = oReq.response;

      /* convert data to binary string */
      let data = new Uint8Array(arraybuffer);
      let arr = new Array();
      for (let i = 0; i !== data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join("");

      /* Call XLSX */
      let workbook = XLSX.read(bstr, {
        type: "binary",
      });

      /* DO SOMETHING WITH workbook HERE */
      let first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      let worksheet = workbook.Sheets[first_sheet_name];
      let x = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
      });
      setXlsx(x);
      console.log(x);
    };
    oReq.send();
    getXlsx();
  }, []);

  return (
    <div className="App">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">TIPO DE BIEN</th>
            <th scope="col">DESCRIPCIóN DIRECCIóN</th>
            <th scope="col">PRECIO DE VENTA</th>
          </tr>
        </thead>
        <tbody>
          {xlsx.map((item, idx) => {
            const { No, TIPO_DE_BIEN, PRECIO_DE_VENTA, DESCRIPCIoN_DIRECCIoN } =
              item;
            return (
              <tr key={idx}>
                <td>{No}</td>
                <td>{TIPO_DE_BIEN}</td>
                <td>{DESCRIPCIoN_DIRECCIoN}</td>
                <td>
                  US $
                  {PRECIO_DE_VENTA.toString().replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
