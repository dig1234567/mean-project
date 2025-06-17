import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handletoLogin = () => {
    navigate("/login");
  };

  const [courseData, setCourseData] = useState(null);
  const [stocks, setStocks] = useState([null]);

  useEffect(() => {
    if (currentUser) {
      CourseService.get()
        .then((data) => {
          setCourseData(data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  const deleteStock = () => {
    if (currentUser) {
      CourseService.delete()
        .then((msg) => {
          window.alert("股票資訊已刪除....");
          setStocks([]);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能看到課程。</p>
          <button className="btn btn-primary btn-lg" onClick={handletoLogin}>
            回到登入頁面
          </button>
        </div>
      )}

      {currentUser && courseData && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div
                className="card"
                style={{ width: "18rem", margin: "1rem" }}
                key={course.id}
              >
                <div className="card-body">
                  <h5 className="card-title">股票名稱: {course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>價格: {course.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {currentUser && (
        <div style={{ padding: "3rem" }}>
          <button onClick={deleteStock}>刪除所有股票</button>
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
