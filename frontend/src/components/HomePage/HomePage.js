import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Notes() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [theDate, setTheDate] = useState(new Date());
    const [isTodayUpcomingNotes, setTodayUpcomingNotes] = useState('notes');
    const [formVisible, setFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/todo');
                const parsedTasks = response.data.map(task => ({
                    ...task,
                    dueDate: task.dueDate ? new Date(task.dueDate) : null,
                }));
                setTasks(parsedTasks);
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        };
        fetchTasks();
    }, []);
    
    const filterTasks = () => {
        const now = new Date();
        return tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            if (!task.dueDate) {
                return isTodayUpcomingNotes === 'notes';
            } if (isTodayUpcomingNotes === 'today') {
                return taskDate.toDateString() === now.toDateString();
            } if (isTodayUpcomingNotes === 'upcoming') {
                return taskDate > now;
            }
        });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const taskDate =
                isTodayUpcomingNotes === 'notes'
                    ? null
                    : theDate || isEditing?.dueDate || new Date();
    
            if (isEditing) {
                const updatedTask = { 
                    title, 
                    desc, 
                    dueDate: taskDate ? taskDate.toISOString() : null,
                    _id: isEditing._id 
                };
                const response = await axios.put('/tasks/update', updatedTask);
                setTasks(tasks.map(task => 
                    task._id === isEditing._id 
                        ? { ...response.data, dueDate: response.data.dueDate ? new Date(response.data.dueDate) : null }
                        : task
                ));
            } else {
                const newTask = { 
                    title, 
                    desc, 
                    dueDate: taskDate ? taskDate.toISOString() : null 
                };
                const response = await axios.post('/tasks', newTask);
                setTasks([...tasks, { ...response.data, dueDate: taskDate }]);
            }
            setFormVisible(false);
            resetForm();
        } catch (err) {
            console.error('Error submitting task:', err);
        }
    };
    
    const resetForm = () => {
        setTitle('');
        setDesc('');
        setTheDate(new Date());
        setIsEditing(null);
    };

    const deleteTask = async (task) => {
        try {
            await axios.put('/tasks/delete', { _id: task._id });
            setTasks(prevTasks => prevTasks.filter(t => t._id !== task._id));
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const stickyNoteClick = (task) => {
        setIsEditing(task);
        setTitle(task.title);
        setDesc(task.desc);
        setTheDate(new Date(task.dueDate));
        setFormVisible(true);
    };

    const createBaseStickyNote = () => {
        resetForm();
        setFormVisible(true);
    };

    return (
        <div className='back-color'>
            <div className="homepage bg-white pb-20 rounded-3xl shadow-xl">
            {formVisible && (
                <div className="form-overlay">
                    <div className="form-container font-semibold text-blue-900 text-center relative">
                    <button
                        type="button"
                        className="absolute top-0 left-2 p-2 text-red-800 flex items-center"
                        onClick={() => setFormVisible(false)}
                        >
                        <svg
                            fill="#000000"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20px"
                            height="20px"
                            viewBox="0 0 52 52"
                            enable-background="new 0 0 52 52"
                            className="mr-2"
                        >
                            <path d="M48.6,23H15.4c-0.9,0-1.3-1.1-0.7-1.7l9.6-9.6c0.6-0.6,0.6-1.5,0-2.1l-2.2-2.2c-0.6-0.6-1.5-0.6-2.1,0L2.5,25c-0.6,0.6-0.6,1.5,0,2.1L20,44.6c0.6,0.6,1.5,0.6,2.1,0l2.1-2.1c0.6-0.6,0.6-1.5,0-2.1l-9.6-9.6C14,30.1,14.4,29,15.3,29h33.2c0.8,0,1.5-0.6,1.5-1.4v-3C50,23.8,49.4,23,48.6,23z"/>
                        </svg>
                        <span>Cancel</span>
                    </button>
                    <span>{isEditing ? 'Edit Sticky Note' : 'New Sticky Note'}</span>
                    <form onSubmit={handleSubmit}>
                        <textarea
                        value={title}
                        onChange={(ev) => setTitle(ev.target.value)}
                        type="text"
                        placeholder="Title"
                        className="mt-3 block bg-blue-50 border border-blue-400 rounded-sm shadow shadow-gray mx-auto w-80 p-3 mb-2 resize-none overflow-y-auto"
                        style={{ height: '50px' }}
                        />
                        <textarea
                        value={desc}
                        onChange={(ev) => setDesc(ev.target.value)}
                        placeholder="Description"
                        rows="5"
                        className="block bg-blue-50 border border-blue-400 rounded-sm shadow shadow-gray mx-auto w-80 p-3 mb-4 resize-none overflow-y-auto"
                        />
                        <div className={isTodayUpcomingNotes === 'notes' ? 'bg-blue-100' : ''}>
                        {(isTodayUpcomingNotes === 'upcoming' || isTodayUpcomingNotes === 'today') && (
                            <div>Due Date:</div>
                        )}
                        {isTodayUpcomingNotes !== 'notes' && (
                            <DatePicker
                            selected={theDate || new Date()}
                            onChange={(date) => setTheDate(date || new Date())}
                            dateFormat="MMM dd, yyyy"
                            className="block mx-auto w-28 text-center border rounded-sm p-2"
                            />
                        )}
                        </div>

                        <button
                        type="submit"
                        className="bg-blue-200 border border-blue-400 block w-1/2 mx-auto rounded-sm shadow shadow-gray m-2 text-blue-800"
                        >
                        Submit
                        </button>
                    </form>
                    </div>
                </div>
                )}
                <div className="homepage flex h-screen">
                    <div className="w-1/6 p-4 flex flex-col justify-between pt-5">
                        <div className="bg-gray-50 rounded-xl h-full shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 pl-4 pt-3"><span>Menu</span></h2>
                            <hr className="border-t-1 border-gray-200 mx-4 pb-2" />
                            <p className="text-sm text-gray-800 font-bold font-mono pl-5 py-2 ">TASKS</p>
                            <ul className="space-y-2">
                                <li 
                                    onClick={() => setTodayUpcomingNotes('today')}
                                    className={`menu-item ${isTodayUpcomingNotes === 'today' ? 'bg-blue-100' : ''}`}
                                >
                                    <svg width="20px" height="20px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z"
                                        fill="#000000"
                                    />
                                    </svg><span>Today</span>
                                </li>
                                <li 
                                    onClick={() => setTodayUpcomingNotes('upcoming')}
                                    className={`menu-item ${isTodayUpcomingNotes === 'upcoming' ? 'bg-blue-100' : ''}`}
                                >
                                    <svg width="20px" height="20px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z"
                                        fill="#000000"
                                    />
                                    </svg>
                                    <span>Upcoming</span>
                                </li>
                                <li 
                                    onClick={() => setTodayUpcomingNotes('notes')}
                                    className={`menu-item ${isTodayUpcomingNotes === 'notes' ? 'bg-blue-100' : ''}`}
                                >
                                    <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-sticky">
                                        <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z"/>
                                    </svg>
                                    <span>Notes</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-l-2 border-gray-200 mx-4 mt-10 mb-10"></div>
                    <div className="w-5/6 p-6 overflow-y-auto">
                        <h3 className="text-4xl text-gray-800 font-bold mb-4">Sticky Notes</h3>
                        <div className="flex flex-wrap justify-start gap-4 pl-5 pt-2">
                            {filterTasks().map(task => (
                                <div 
                                    key={task._id} 
                                    className="sticky-note w-48 h-48 md:w-56 lg:w-64 border-l-4 border-blue-400 bg-yellow-100 text-left p-4 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                    onClick={() => stickyNoteClick(task)}
                                >
                                    <h4 className="font-bold text-blue-800">{task.title}</h4>
                                    <p className="text-sm text-gray-700">{task.desc}</p>
                                </div>
                            ))}
                            <div
                                className="sticky-note w-48 h-48 md:w-56 lg:w-64 border-l-4 border-blue-400 bg-gray-200 text-left p-4 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={createBaseStickyNote}
                            >
                                <h4 className="font-bold text-blue-800">+ Add a Sticky Note</h4>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Notes;