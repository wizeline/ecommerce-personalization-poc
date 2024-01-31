import { useEffect, useState } from "react";

const DataDisplay = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      setData(await result.json());
    };

    fetchData();
  }, []);

  return (
    <div>
      {data && (
        <div>
          <p>hola</p>
          {/* <h2>{data.title}</h2>
          <p>{data.body}</p> */}
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
