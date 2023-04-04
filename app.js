const url = 'https://crudcrud.com/api/edb9cee4281b40c5affd907d94dd4a14/tasks';

async function getData() {
    const response = await axios.get(url);
    return response.data;
  }
  async function getIdData(id) {
    const response = await axios.get(`${url}/${id}`);
    return response.data;
  }


async function postData(data) {
  const response = await axios.post(url,data);
  return response.data;
}

async function updateData(data,id) {
    const response = await axios.put(`${url}/${id}`, data);
    return response.data;
  }
async function deleteTask(data) {
  const response = await axios.delete(`${url}/${data}`);
  return response.data;
}

document.addEventListener("DOMContentLoaded",async ()=>{
    const form = document.getElementById('form');
    const todoList = document.getElementById('todo');
    const completedList = document.getElementById('completed');

    await loadContent();
    const submit = form.querySelector('#submit')
    submit.addEventListener('click',event=>handleSubmit(event,form));
    todoList.addEventListener('click',handleList);
    
    async function loadContent(){
        try{
            const response = await getData();
            renderHtml(response);
        }catch(e){
            console.log(e);
        }
    }
    async function renderHtml(res){
      console.log(res)
        for (const task of res) {
          if (task.isComplete==false){
            createList(task);
          }else{
            const listItem = document.createElement('li');
            listItem.innerHTML = `
              <span>${task.title}</span>
              <span>${task.description}</span>`;
              completedList.appendChild(listItem)
          }
          }
    }
    function createList(task){
        const listItem = document.createElement('li');
            listItem.innerHTML = `
              <span>${task.title}</span>
              <span>${task.description}</span>
              <button class="complete-button" data-id="${task._id}">Complete</button>
              <button class="delete-button" data-id="${task._id}">Delete</button>
            `;
            todoList.appendChild(listItem);
    }
    async function handleSubmit(event,form){
        event.preventDefault();
        
        const titleSpan = form.querySelector('#title');
        const descriptionSpan = form.querySelector('#description');
        const title = titleSpan.value;
        const description = descriptionSpan.value
        const isComplete =false;

        if (!title || !description) {
          alert('Please enter all the details');
          return;
        }
        
        try{
            const obj ={title,description,isComplete}
            const res = await postData(obj);
            const newTask = res;
            titleSpan.value ='';
            descriptionSpan.value ='';
            createList(newTask);
        }catch(e){
            console.log(e);
        }
    }
    async function handleList(event) {
        // Handle clicks on the delete button
        if (event.target.classList.contains('delete-button')) {
          event.preventDefault();
          const id = event.target.dataset.id;
          try {
            await deleteTask(id);
            const listItem = event.target.parentElement;
            listItem.remove();
          } catch (error) {
            console.error(error);
          }
        }
        // Handle clicks on the edit button
        if (event.target.classList.contains('complete-button')) {
          event.preventDefault();
          const id = event.target.dataset.id;
          const data = await getIdData(id)
            const listItem = event.target.parentElement;
            const title = data.title;
            const description = data.description;
            const isComplete = true;
            // Update the appointment in the API
            try{
                const res = await updateData({title,description,isComplete},id)
                // Update the list item with the updated appointment data
                listItem.remove()
                const item = document.createElement('li');
                item.innerHTML = `
                <span>${title}</span>
                <span>${description}</span>`;
                completedList.appendChild(item)
              }catch(error) {
                console.error(error);
                alert('There was an error updating the appointment.');
              }
          }
      
      }
      
})