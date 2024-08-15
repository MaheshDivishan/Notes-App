import React from 'react'
import { MdCreate, MdDelete, MdOutlinePushPin } from 'react-icons/md'
import moment from "moment"

const NoteCard = (
    {
        title,
        date,
        content,
        tags,
        isPinned,
        onEdit,
        onDelete,
        onPinNote
    }
) => {
  return (
    <div className='p-4 transition-all ease-in-out bg-white border rounded hover:shadow-xl'>
        <div className='flex items-center justify-between'>
           <h6 className='text-sm font-medium'>{title}</h6>
           {/* <span className='text-xs text-slate-500'>{date}</span> */}
           <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />


        </div>

        <div className='flex items-center justify-between mt-2 '>
        <div className='text-xs text-slate-500'>{moment(date).format('Do MMM YYYY')}</div>


        </div>

        <p className='mt-2 text-xs text-slate-600'>{content?.slice(0,60)}</p>

        <div className='flex items-center justify-between mt-2 '>
            <div className='text-xs text-slate-500'>{tags.map((item) => `#${item}`)}</div>
                <div className='flex items-center gap-2 '>
                    <MdCreate className='icon-btn hover:text-green-600' onClick={onEdit}/>
                    <MdDelete className='icon-btn hover:text-red-500' onClick={onDelete}/>
                </div>
            
        </div>
    </div>
  )
}

export default NoteCard;