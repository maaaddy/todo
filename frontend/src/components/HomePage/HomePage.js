import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/todo');
                setTasks(response.data);
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        };
        fetchTasks();
    }, []);

    function handleSubmit(ev) {
        ev.preventDefault();
        if(isEditing) {
            axios.put('/tasks/${isEditing.id}', { title, desc })
            .then(response => {
                setTasks(tasks.map(task => task.id === isEditing.id ? response.data : task));
                setIsEditing(null);
                setFormVisible(false);
            })
            .catch(err => {
                console.error('Error editing task:', err);
            });
        }
        else {
            axios.post('/tasks', { title, desc })
                .then(response => {
                    console.log('Task created:', response.data);
                    setTasks([...tasks, response.data]);
                    setFormVisible(false);
                })
                .catch(err => {
                    console.error('Error posting task:', err);
                });
        }
        setTitle('');
        setDesc('');
    }

    const stickyNoteClick = (task) => {
        setIsEditing(task);
        setTitle(task.title);
        setDesc(task.desc);
        setFormVisible(true);
    };

    const createBaseStickyNote = () => {
        setIsEditing(null);
        setTitle('');
        setDesc('');
        setFormVisible(true);
    };

    return (
        <div className="homepage pb-20">
            {formVisible && (
                <div className="flex shadow">
                    <div className="mx-auto">
                        <form onSubmit={handleSubmit}>
                            <input
                                value={title}
                                onChange={(ev) => setTitle(ev.target.value)}
                                type="text"
                                placeholder="Title"
                                className="block bg-blue-50 border border-blue-400 rounded-sm shadow shadow-gray m-2"
                            />
                            <input
                                value={desc}
                                onChange={(ev) => setDesc(ev.target.value)}
                                type="text"
                                placeholder="Description"
                                className="block bg-blue-50 border border-blue-400 rounded-sm shadow shadow-gray m-2"
                            />
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
                <div className="w-1/6 p-4 flex flex-col justify-between">
                    <div className="bg-gray-50 rounded-xl h-full shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pl-4 pt-3">Menu</h2>
                        <hr className="border-t-1 border-gray-200 mx-4 pb-2" />
                        <p className="text-xs text-gray-800 font-bold font-mono pl-6 py-2 ">TASKS</p>
                        <ul className="space-y-2">
                            <li className="p-2 mx-2 ml-4 rounded-lg text-gray-800 hover:bg-blue-300 hover:text-black transition-all duration-300">||||| Today</li>
                            <li className="p-2 mx-2 ml-4 rounded-lg text-gray-800 hover:bg-blue-300 hover:text-black transition-all duration-300">||||| Upcoming</li>
                            <li className="p-2 mx-2 ml-4 rounded-lg text-gray-800 hover:bg-blue-300 hover:text-black transition-all duration-300">||||| Notes</li>
                        </ul>
                    </div>
                </div>

                <div className="border-l-2 border-gray-200 mx-4 mt-10 mb-10"></div>

                <div className="w-5/6 p-6 overflow-y-auto">
                    <h3 className="text-2xl text-gray-800 font-bold pt-1 mb-4">Sticky Notes</h3>
                    <div className="flex flex-wrap justify-start gap-4 pl-5 pt-2">
                        {tasks.map((task, index) => (
                            <div
                                key={index}
                                className="sticky-note w-48 md:w-56 lg:w-64 border-l-4 border-blue-400 bg-yellow-100 text-left p-4 hover:scale-105 hover:shadow-lg transition-all duration-300"
                                onClick={() => stickyNoteClick(task)}
                            >
                                <h4 className="font-bold text-blue-800">{task.title}</h4>
                                <p className="text-sm text-gray-700">{task.desc}</p>
                            </div>
                        ))}
                        <div
                            className="sticky-note w-48 md:w-56 lg:w-64 border-l-4 border-blue-400 bg-gray-200 text-left p-4 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={createBaseStickyNote}
                        >
                            <h4 className="font-bold text-blue-800">+ Add a Sticky Note</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;