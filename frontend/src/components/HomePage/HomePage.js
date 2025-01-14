import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

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
        axios.post('/tasks', { title, desc })
            .then(response => {
                console.log('Task created:', response.data);
                setTasks([...tasks, response.data]);
            })
            .catch(err => {
                console.error('Error posting task:', err);
            });
        setTitle('');
        setDesc('');
    }

    return (
        <div className="homepage pb-20">
            <div className='flex mx-auto pt-6'>
                <span className="mx-auto text-lg font-bold text-blue-800">Maddy's To-Do List:</span>
            </div>
            <div className='flex shadow'>
                <div className='mx-auto'>
                    <form onSubmit={handleSubmit}>
                        <input 
                            value={title}
                            onChange={ev => setTitle(ev.target.value)}
                            type="text"
                            placeholder="title"
                            className="block bg-blue-50 border border-blue-400 rounded-sm shadow shadow-gray m-2"
                        />
                        <input 
                            value={desc}
                            onChange={ev => setDesc(ev.target.value)}
                            type="text"
                            placeholder="desc"
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
            <div>
                <h3>Tasks:</h3>
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>{task.title}: {task.desc}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default HomePage;