import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./style.css"; 
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Spinner from "react-bootstrap/Spinner";

const CameraTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false); 
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  const statusFormatter = (cell) => {
    const chipStyle = {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "15px",
      color: "white",
      fontWeight: "bold",
    };

    const statusColor = cell.toLowerCase() === "active" ? "green" : "red";
    return (
      <span style={{ ...chipStyle, backgroundColor: statusColor }}>{cell}</span>
    );
  };

  const handleUpdateStatus = async () => {
    if (currentCamera && newStatus) {
      try {
        const response = await fetch(
          `https://api-app-staging.wobot.ai/app/v1/update/camera/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer 4ApVMIn5sTxeW7GQ5VWeWiy",
            },
            body: JSON.stringify({ status: newStatus, id: currentCamera }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
        setModalIsOpen(false);
        setNewStatus("");
        fetchCameras();
      } catch (error) {
        setError("Failed to update status. Please try again later.");
        console.log(error);
      }
    }
  };

  const columns = [
    {
      dataField: "name",
      text: "Name",
      headerStyle: { color: '#666666'},
      formatter: (cell) => {
        return (
          <span style={{ color: '#666666' }}> 
            {cell ? cell : "N/A"}
          </span>
        );
      }
    },
    
    {
      dataField: "location",
      text: "Location",
      headerStyle: { color: '#666666'},
       formatter: (cell) => {
        return (
          <span style={{ color: '#666666' }}> 
            {cell ? cell : "N/A"}
          </span>
        );
      }
    },
    {
      dataField: "recorder",
      text: "Recorder",
      headerStyle: { color: '#666666'},
      formatter: (cell) => {
        return (
          <span style={{ color: '#666666' }}> 
            {cell ? cell : "N/A"}
          </span>
        );
      }
    },
    {
      dataField: "tasks",
      text: "Tasks",
      headerStyle: { color: '#666666' },
      formatter: (cell) => {
        return (
          <span style={{ color: '#666666' }}> 
            {`${cell} Tasks`} 
          </span>
        );
      }
    },
    {
      dataField: "status",
      text: "Status",
      headerStyle: { color: '#666666' },
      formatter: statusFormatter,
    },
    {
      dataField: "action",
      text: "Action",
      headerStyle: { color: '#666666' }, 
      formatter: (cell, row) => (
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            setCurrentCamera(row.id);
            setNewStatus(row.status);
            setModalIsOpen(true);
          }}
        >
          Update Status
        </button>
      ),
    },
  ];

  const fetchCameras = async () => {
    setLoading(true); 
    try {
      const response = await fetch(
        "https://api-app-staging.wobot.ai/app/v1/fetch/cameras",
        {
          headers: {
            Authorization: "Bearer 4ApVMIn5sTxeW7GQ5VWeWiy",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.log(error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const filteredData = data.filter((val) => {
    const locationMatch = val.location
      .toLowerCase()
      .includes(locationFilter.toLowerCase());
    const statusMatch = statusFilter
      ? val.status.toLowerCase() === statusFilter.toLowerCase()
      : true;
    const searchMatch =
      val.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      val.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      val.recorder.toLowerCase().includes(searchQuery.toLowerCase());
    return locationMatch && statusMatch && searchMatch; 
  });

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} entries
    </span>
  );

  const options = {
    page,
    sizePerPage,
    totalSize: filteredData.length,
    showTotal: true,
    paginationTotalRenderer: customTotal,
    pageStartIndex: 1,
    sizePerPageList: [
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
    ],
    onPageChange: (newPage) => {
      setPage(newPage);
    },
    onSizePerPageChange: (newSizePerPage) => {
      setSizePerPage(newSizePerPage);
      setPage(1);
    },
  };

  return (
    <div
      style={{ width: "100%", padding: "20px", backgroundColor: "whitesmoke" }}
    >
      <div>
        <h3
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "left",
            fontWeight:"bold"
            
          }}
        >
        Cameras
          <span
            style={{ display: "flex", justifyContent: "center", flexGrow: 1 }}
          >
            <img
              src="../Assests/wobotailogo.png" 
              alt="Wobot logo" 
              style={{ width: "10%", height: "auto", marginBottom: "2rem" ,marginRight:"15rem"}} 
            />
          </span>
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h5 style = {{color:"#666666"}}>Manage your cameras here.</h5>

          <input
            className="form-control"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "20%", marginBottom: "1rem" }} 
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.3rem",
          marginBottom: "1rem",
          width: "20%",
        }}
      >
        <input
          className="form-control"
          type="text"
          placeholder="Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <input
          className="form-control"
          type="text"
          placeholder="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>
      <div
        style={{
          width: "100%",
          backgroundColor: "whitesmoke",
          position: "relative",
        }}
      >
        {filteredData.length > 0 ? (
          <>
            <BootstrapTable
              keyField="_id"
              data={filteredData}
              columns={columns}
              pagination={paginationFactory(options)}
            />
          </>
        ) : (
          <div>No data found</div>
        )}
      </div>

     
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Update Camera Status"
        ariaHideApp={false}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            padding: "20px",
            width: "400px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <div className="modal-header" style={{display:"flex", justifyContent:"start"}}>
          <h3>Update Camera Status</h3>
        </div>
        <div style={{display:"flex", justifyContent:"start"}}>
          <label style={{fontSize:"1rem", marginTop:"10px"}}>
            New Status:
            <select
              className="form-control"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ width: "22.5rem", marginTop:"10px" }}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
        <div style={{ marginTop: "20px", display:"flex", justifyContent:"end"}}>
          <button
            className="btn btn-success"
            onClick={handleUpdateStatus}
            style={{ marginRight: "10px" }}
          >
            Save
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setModalIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CameraTable;
