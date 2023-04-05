import axios from "axios";
let url = "http://localhost:3001/persons";

const getAll = () => {
    return axios.get(url);
}
const delUser = (id) => {
    return axios.delete(url+"/"+id);
}

const addPerson = (userObject) => {
    return axios.post(url, userObject);
}

const updateNumber = (id, newObject) => {
    return axios.put(url+"/"+id, newObject);
}

export default { 
    getAll: getAll, 
    delUser: delUser, 
    addPerson: addPerson,
    updateNumber: updateNumber 
  }

