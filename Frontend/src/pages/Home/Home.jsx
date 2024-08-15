import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNote from './AddEditNote';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';

const Home = () => {
  const [openAddEditModel,setOpenAddEditModel] = useState({
      isShown:false,
      type:"add",
      data:null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: '',
    type: 'add',
  });

  const [userInfo,setUserInfo] = useState(null);
  const [allNotes,setAllNotes] = useState(null);
  const navigate = useNavigate();

  const [isSearch,setIsSearch] = useState(false);

//Get User Info
  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    }catch(error){
      if(error.response.status == 401){
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: '',
    });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };



// Get all Notes
const getAllNotes = async () => {
  try {
    const response = await axiosInstance.get("/get-all-notes");

    if (response.data && response.data.notes) {
      setAllNotes(response.data.notes);
    }
  } catch (error) {
    console.log("An unexpected error occurred. Please try again later.");
  }
};

//Delete Note
const deleteNote = async(data) => {

  const noteId = data._id;
  try{
      const response = await axiosInstance.delete("/delete-note/"+ noteId)

      if(response.data && !response.data.error){
          showToastMessage("Note Deleted Successfully", "delete");
          getAllNotes();
      }
  }catch(error){
      console.log(error.response.data.message);

  }

}

//Search for a Note
const onSearchNote = async(query) => {

  try{
      const response = await axiosInstance.get("/search-notes/", {
        params: {query},
      });


      if(response.data && response.data.notes){
          setIsSearch(true);
          setAllNotes(response.data.notes);
      }
  }catch(error){
      console.log(error);

  }
}

const handleClearSearch = () => {
  setIsSearch(false);
  getAllNotes();
}

const updateIsPinned = async(noteData) => {
  const noteId = noteData._id;
  try{
      const response = await axiosInstance.put("/update-note-pinned/"+ noteId, {
          isPinned: !noteData.isPinned
      });

      if(response.data && response.data.note){
          getAllNotes();
      }
  }catch(error){
      console.log(error)

  }
}


  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return() => {}
  }, [])





  return (
    <>
    <Navbar userInfo= {userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}  />
    <div className='container mx-auto'>

     <div className='grid grid-cols-3 gap-4 mt-8'>
      {allNotes?.map((item,index) => (
     <NoteCard key={item._id} title={item.title} date={item.createdOn} content = {item.content}
      tags={item.tags}
      isPinned={item.isPinned}
      onEdit={() => {
        setOpenAddEditModel({isShown:true, type: "edit" , data: item});
      }}
      onDelete={() => deleteNote(item)}
      onPinNote={() => updateIsPinned(item)}/>))}

     </div>

    </div>

    <button className='absolute flex items-center justify-center w-16 h-16 rounded-2xl bg-primary hover:bg-blue-600 right-10 bottom-10' onClick={() => {
      setOpenAddEditModel({isShown:true, type: "add" , data: null});
    }}>
      <MdAdd className='text-[32px] text-white'/>
    </button>

    <Modal
    isOpen = {openAddEditModel.isShown}
    onRequestClose = {() => {}}
    style = {{
      overlay:{
        backgroundColor:"rgba(0,0,0,0.2)",
      },
    }}
    contentLabel=""
    className= "w-[40%] max-h-3/4 bg-white mx-auto mt-14 p-5 "
     ><AddEditNote type={openAddEditModel.type} noteData={openAddEditModel.data} onClose={() => {
      setOpenAddEditModel({isShown:false, type: "add", data:null})
     }} getAllNotes={getAllNotes} showToastMessage={showToastMessage}/>
     </Modal>

     <Toast 
     isShown={showToastMsg.isShown}
     message={showToastMsg.message}
     type={showToastMsg.type}
     onClose={handleCloseToast} />
    </>
  )
}

export default Home;